const Product = require("../models/Product");
const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { content, reviewerName, rating } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại." });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá phải từ 1 đến 5 sao",
      });
    }

    const review = new Review({
      reviewerName,
      content,
      rating: ratingNum,
    });
    await review.save();
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Đánh giá đã được thêm thành công!",
      review,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ success: false, message: "Có lỗi xảy ra khi thêm đánh giá." });
  }
};

exports.getReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("reviews");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại." });
    }

    res.status(200).json({ success: true, data: product.reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Có lỗi xảy ra khi lấy đánh giá." });
  }
};
