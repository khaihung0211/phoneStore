const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.post("/", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.put("/items/:itemId", protect, cartController.updateCartItem);

module.exports = router;
