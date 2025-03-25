const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  
  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ 
    slug: req.params.slug,
    isActive: true 
  });
  
  if (!category) {
    res.status(404);
    throw new Error('Không tìm thấy danh mục');
  }
  
  res.json({
    success: true,
    data: category
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, image } = req.body;
  const slug = slugify(name, { lower: true, locale: 'vi' });
  
  const categoryExists = await Category.findOne({ slug });
  
  if (categoryExists) {
    res.status(400);
    throw new Error('Danh mục đã tồn tại');
  }
  
  const category = await Category.create({
    name,
    slug,
    icon,
    image
  });
  
  res.status(201).json({
    success: true,
    data: category
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, icon, image, isActive } = req.body;
  
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Không tìm thấy danh mục');
  }
  
  if (name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, locale: 'vi' });
  }
  
  if (icon !== undefined) {
    category.icon = icon;
  }
  
  if (image !== undefined) {
    category.image = image;
  }
  
  if (isActive !== undefined) {
    category.isActive = isActive;
  }
  
  const updatedCategory = await category.save();
  
  res.json({
    success: true,
    data: updatedCategory
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Không tìm thấy danh mục');
  }
  
  await category.deleteOne();
  
  res.json({
    success: true,
    message: 'Danh mục đã được xóa'
  });
});

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};