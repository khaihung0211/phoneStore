const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router.get("/", protect, admin, orderController.getAllOrders);
router.post("/", protect, orderController.createOrder);
router.get("/my-orders", protect, orderController.getUserOrders);
router.get("/:id", protect, orderController.getOrderDetails);
router.put("/:id/cancel", protect, orderController.cancelOrder);
router.put("/:id/status", protect, admin, orderController.updateOrderStatus);

module.exports = router;
