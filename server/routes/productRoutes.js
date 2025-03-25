const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const upload = require("../utils/upload");

router.get("/search", productController.searchProducts);
router.post("/:id/reviews", reviewController.addReview);
router.get("/:id/reviews", reviewController.getReviews);

router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/:id", productController.getProductById);

router.post(
  "/",
  protect,
  upload.single("image"),
  (req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (e) {}
      });
    }
    next();
  },
  productController.createProduct
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  (req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (e) {}
      });
    }
    next();
  },
  productController.updateProduct
);
router.delete("/:id", protect, productController.deleteProduct);

module.exports = router;
