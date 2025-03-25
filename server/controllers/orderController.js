const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { asyncHandler } = require("../middleware/errorMiddleware");

exports.createOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price stock image",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống, không thể tạo đơn hàng",
      });
    }

    for (const cartItem of cart.items) {
      if (cartItem.quantity > cartItem.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${cartItem.product.name} không đủ số lượng trong kho`,
        });
      }
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
    });

    const savedOrder = await newOrder.save({ session });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    await Cart.findByIdAndUpdate(
      cart._id,
      { $set: { items: [] } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedOrder = await Order.findById(savedOrder._id)
      .populate({
        path: "items.product",
        select: "name price image",
      })
      .populate({
        path: "user",
        select: "name email",
      });

    return res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: populatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId })
    .populate({
      path: "items.product",
      select: "name price image",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

exports.getOrderDetails = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    const rawOrder = await Order.findById(orderId);

    if (!rawOrder) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (
      rawOrder.user &&
      rawOrder.user.toString() !== userId &&
      req.user.role != "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    const order = await Order.findById(orderId)
      .populate({
        path: "items.product",
        select: "name price image",
        options: { strictPopulate: false },
      })
      .populate({
        path: "user",
        select: "name email",
        options: { strictPopulate: false },
      })
      .lean();

    if (!order.user && rawOrder.user) {
      order.user = {
        _id: rawOrder.user.toString(),
        name: "Tài khoản đã bị xóa",
        email: "deleted@account.com",
        isDeleted: true,
      };
    }

    if (order.items && Array.isArray(order.items)) {
      order.items = order.items.map((item) => {
        if (!item.product) {
          item.product = {
            _id: "deleted",
            name: "Sản phẩm đã bị xóa",
            price: item.price,
            image: null,
            isDeleted: true,
          };
        }
        return item;
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại sau",
      error: error.message,
    });
  }
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      res.status(404);
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.user.toString() !== userId && req.user.role != "admin") {
      res.status(403);
      throw new Error("Bạn không có quyền hủy đơn hàng này");
    }

    if (order.status !== "pending" && order.status !== "processing") {
      res.status(400);
      throw new Error("Không thể hủy đơn hàng ở trạng thái này");
    }

    order.status = "cancelled";
    await order.save({ session });
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  if (!status && !paymentStatus) {
    res.status(400);
    throw new Error("Vui lòng cung cấp trạng thái cần cập nhật");
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const order = await Order.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).populate({
    path: "items.product",
    select: "name price image",
  });

  if (!order) {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }

  res.status(200).json({
    success: true,
    message: "Cập nhật trạng thái đơn hàng thành công",
    data: order,
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder || "desc";
  const status = req.query.status;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const searchTerm = req.query.search;

  const skip = (page - 1) * limit;

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (fromDate && toDate) {
    filter.createdAt = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  } else if (fromDate) {
    filter.createdAt = { $gte: new Date(fromDate) };
  } else if (toDate) {
    filter.createdAt = { $lte: new Date(toDate) };
  }

  if (searchTerm) {
    filter.$or = [
      { "shippingAddress.name": { $regex: searchTerm, $options: "i" } },
      { "shippingAddress.phoneNumber": { $regex: searchTerm, $options: "i" } },
    ];
  }

  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("items.product", "name image")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
});
