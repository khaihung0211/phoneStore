const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/", protect, restrictTo('admin'), userController.getAllUsers);

router.get("/:id", protect,  userController.getUserById);

router.post("/", protect, restrictTo('admin'), userController.createUser);

router.patch("/:id", protect, userController.updateUser);

router.delete("/:id", protect, restrictTo('admin'), userController.deleteUser);

module.exports = router;
