class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  const error = new ApiError(`Không tìm thấy: ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Lỗi server, vui lòng thử lại sau",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { notFound, errorHandler, asyncHandler, ApiError };
