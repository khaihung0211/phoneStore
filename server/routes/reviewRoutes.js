const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const upload = require("../utils/upload");

router.post("/:id", reviewController.addReview);
router.get("/:id", reviewController.getReviews);

module.exports = router;
