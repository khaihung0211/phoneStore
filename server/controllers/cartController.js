const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json({
      success: true,
      message: "Sản phẩm đã được thêm vào giỏ hàng.",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi thêm vào giỏ hàng.",
    });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Giỏ hàng không tồn tại." });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Có lỗi xảy ra khi lấy giỏ hàng." });
  }
};

exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Giỏ hàng không tồn tại." });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật số lượng thành công!",
        cart,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại trong giỏ hàng.",
      });
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật số lượng.",
    });
  }
};
