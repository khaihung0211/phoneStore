const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post(
  "/register",
  [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Họ tên không được để trống"),
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
    body("phone")
      .optional()
      .isMobilePhone("vi-VN")
      .withMessage("Số điện thoại không hợp lệ"),
  ],
  authController.register
);

router.post("/login", authController.login);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", protect, authController.logout);

router.get("/me", protect, authController.getCurrentUser);

module.exports = router;
