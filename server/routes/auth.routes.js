const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { uploadSingle } = require("../utils/cloudinary.service");

// Validation middleware
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const resetPasswordValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
];

const newPasswordValidation = [
  body("token").notEmpty().withMessage("Token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// User routes
router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.post("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post(
  "/forgot-password",
  resetPasswordValidation,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  newPasswordValidation,
  authController.resetPassword
);

// Vendor routes
router.post(
  "/vendor/register",
  registerValidation,
  uploadSingle("logo"),
  authController.vendorRegister
);
router.post("/vendor/login", loginValidation, authController.vendorLogin);
router.post("/vendor/verify-email/:token", authController.verifyVendorEmail);
router.post(
  "/vendor/resend-verification",
  authController.resendVendorVerification
);
router.post(
  "/vendor/forgot-password",
  resetPasswordValidation,
  authController.vendorForgotPassword
);
router.post(
  "/vendor/reset-password",
  newPasswordValidation,
  authController.vendorResetPassword
);

// Delivery partner routes
router.post(
  "/delivery/register",
  registerValidation,
  uploadSingle("profilePicture"),
  authController.deliveryRegister
);
router.post("/delivery/login", loginValidation, authController.deliveryLogin);
router.post(
  "/delivery/verify-email/:token",
  authController.verifyDeliveryEmail
);
router.post(
  "/delivery/resend-verification",
  authController.resendDeliveryVerification
);
router.post(
  "/delivery/forgot-password",
  resetPasswordValidation,
  authController.deliveryForgotPassword
);
router.post(
  "/delivery/reset-password",
  newPasswordValidation,
  authController.deliveryResetPassword
);

module.exports = router;
