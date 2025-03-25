const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục không được để trống'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    icon: {
      type: String,
      default: 'category'
    },
    image: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

module.exports = mongoose.model('Category', categorySchema);