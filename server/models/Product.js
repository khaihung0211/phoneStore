const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả sản phẩm là bắt buộc"],
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá không được âm"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Giá gốc không được âm"],
    },
    image: {
      type: String,
      required: [true, "Hình ảnh sản phẩm là bắt buộc"],
    },
    gallery: [String],
    brand: {
      type: String,
      required: [true, "Thương hiệu là bắt buộc"],
    },
    category: {
      type: String,
      required: [true, "Danh mục là bắt buộc"],
    },
    stock: {
      type: Number,
      required: [true, "Số lượng tồn kho là bắt buộc"],
      default: 0,
      min: [0, "Số lượng không được âm"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specifications: {
      type: Object,
      default: {},
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = this.name.split(" ").join("-").toLowerCase();
  next();
});

module.exports = mongoose.model("Product", productSchema);
