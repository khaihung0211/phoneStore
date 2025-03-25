const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: [true, "Tên người đánh giá là bắt buộc"],
  },
  content: {
    type: String,
    required: [true, "Nội dung đánh giá là bắt buộc"],
  },
  rating: {
    type: Number,
    required: [true, "Số sao đánh giá là bắt buộc"],
    min: 1,
    max: 5,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
