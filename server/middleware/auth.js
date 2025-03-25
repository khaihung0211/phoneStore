const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ApiError } = require("./errorMiddleware");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      throw new ApiError("Không có quyền truy cập, vui lòng đăng nhập", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError("Người dùng không tồn tại", 401);
    }

    if (decoded.exp < Date.now() / 1000) {
      throw new ApiError(
        "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
        401
      );
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError("Token không hợp lệ", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError("Token đã hết hạn, vui lòng đăng nhập lại", 401)
      );
    }
    next(error);
  }
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError("Vui lòng đăng nhập để tiếp tục", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Vai trò ${req.user.role} không có quyền truy cập tài nguyên này`,
          403
        )
      );
    }

    next();
  };
};
exports.admin = (req, res, next) => {
  if (!req.user || !req.user.role === "admin") {
    return next(
      new ApiError("Không có quyền truy cập, yêu cầu quyền admin", 403)
    );
  }
  next();
};
exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.role === "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "1d" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );

  return { accessToken, refreshToken };
};

exports.verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    throw new ApiError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError("Vui lòng đăng nhập để tiếp tục", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Vai trò ${req.user.role} không có quyền truy cập tài nguyên này`,
          403
        )
      );
    }

    next();
  };
};
