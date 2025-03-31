const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  verifyToken,
  isDeliveryPartner,
} = require("../middleware/auth.middleware");
const deliveryController = require("../controllers/delivery.controller");
const cloudinaryService = require("../utils/cloudinary.service");

// Validation middleware
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("vehicleType")
    .isIn(["bicycle", "motorcycle", "car", "scooter"])
    .withMessage("Invalid vehicle type"),
  body("vehicleNumber").notEmpty().withMessage("Vehicle number is required"),
];

const updateProfileValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),
  body("vehicleType")
    .optional()
    .isIn(["bicycle", "motorcycle", "car", "scooter"])
    .withMessage("Invalid vehicle type"),
  body("vehicleNumber")
    .optional()
    .notEmpty()
    .withMessage("Vehicle number cannot be empty"),
];

// Auth routes
router.post(
  "/register",
  registerValidation,
  cloudinaryService.uploadSingle("profilePicture"),
  deliveryController.register
);
router.post("/login", deliveryController.login);
router.post("/verify-email/:token", deliveryController.verifyEmail);
router.post("/forgot-password", deliveryController.forgotPassword);
router.post("/reset-password", deliveryController.resetPassword);

// Protected routes
router.use(verifyToken, isDeliveryPartner);

// Profile routes
router.get("/profile", deliveryController.getProfile);
router.put(
  "/profile",
  updateProfileValidation,
  deliveryController.updateProfile
);
router.put(
  "/profile/picture",
  cloudinaryService.uploadSingle("profilePicture"),
  deliveryController.updateProfilePicture
);
router.put("/location", deliveryController.updateLocation);
router.put("/availability", deliveryController.updateAvailability);

// Order routes
router.get("/orders", deliveryController.getOrders);
router.get("/orders/:orderId", deliveryController.getOrderDetails);
router.put("/orders/:orderId/status", deliveryController.updateOrderStatus);
router.post("/orders/:orderId/pickup", deliveryController.pickupOrder);
router.post("/orders/:orderId/deliver", deliveryController.deliverOrder);
router.post("/orders/:orderId/cancel", deliveryController.cancelOrder);

// Earnings routes
router.get("/earnings", deliveryController.getEarnings);
router.get("/earnings/daily", deliveryController.getDailyEarnings);
router.get("/earnings/weekly", deliveryController.getWeeklyEarnings);
router.get("/earnings/monthly", deliveryController.getMonthlyEarnings);

// Bank details routes
router.get("/bank-details", deliveryController.getBankDetails);
router.put("/bank-details", deliveryController.updateBankDetails);

// Analytics routes
router.get("/analytics", deliveryController.getAnalytics);
router.get("/performance", deliveryController.getPerformance);

module.exports = router;
