const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Hàm tạo token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Hàm tạo refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    // Kiểm tra lỗi validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { fullName, email, password, phone } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    // Tạo user mới
    const user = new User({
      fullName,
      email,
      password,
      phone,
    });

    await user.save();

    // Tạo token
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Lưu refresh token vào DB
    user.refreshToken = refreshToken;
    await user.save();

    // Loại bỏ password trước khi gửi response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      token,
      refreshToken,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi đăng ký tài khoản",
      error: error.message,
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email và password đã được cung cấp chưa
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp email và mật khẩu",
      });
    }

    // Kiểm tra user tồn tại không
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    // Tạo token
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Lưu refresh token vào DB
    user.refreshToken = refreshToken;
    await user.save();

    // Loại bỏ password trước khi gửi response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      refreshToken,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi đăng nhập",
      error: error.message,
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy Refresh Token",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Kiểm tra user và refresh token trong DB
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token không hợp lệ",
      });
    }

    // Tạo token mới
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Lưu refresh token mới vào DB
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Làm mới token thành công",
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Refresh Token không hợp lệ",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh Token đã hết hạn",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi làm mới token",
      error: error.message,
    });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  try {
    // Xóa refresh token trong DB
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi đăng xuất",
      error: error.message,
    });
  }
};

// Lấy thông tin user hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi lấy thông tin người dùng",
      error: error.message,
    });
  }
};
