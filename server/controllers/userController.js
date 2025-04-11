const User = require("../models/User");
const mongoose = require("mongoose");
const { asyncHandler } = require("../middleware/errorMiddleware");

exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại sau",
      error: error.message,
    });
  }
});

exports.getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  console.log("ID: ", userId)
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy người dùng" });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, address, role } = req.body;

  const newUser = await User.create({
    fullName,
    email,
    password,
    phone,
    address,
    role,
  });

  res.status(201).json({
    success: true,
    message: "Tạo người dùng thành công",
    data: newUser,
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ" });
  }

  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  if (!updatedUser) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy người dùng" });
  }

  res.status(200).json({
    success: true,
    message: "Cập nhật thông tin người dùng thành công",
    data: updatedUser,
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ" });
  }
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy người dùng" });
  }

  res.status(200).json({
    success: true,
    message: "Xóa người dùng thành công",
  });
});
