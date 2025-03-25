const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/auth");

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
