const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { auth } = require("../middleware/delivery");
const deliveryController = require("../controllers/delivery.controller");
const upload = require("../middleware/upload");

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
router.post("/register", registerValidation, deliveryController.register);
router.post("/login", deliveryController.login);
router.post("/verify-email/:token", deliveryController.verifyEmail);
router.post("/forgot-password", deliveryController.forgotPassword);
router.post("/reset-password", deliveryController.resetPassword);

// Protected routes
router.use(auth);

// Profile routes
router.get("/profile", deliveryController.getProfile);
router.put(
  "/profile",
  updateProfileValidation,
  deliveryController.updateProfile
);
router.put(
  "/profile-picture",
  upload.single("profilePicture"),
  deliveryController.updateProfilePicture
);
router.put("/location", deliveryController.updateLocation);
router.put("/availability", deliveryController.updateAvailability);
router.put("/online-status", deliveryController.updateOnlineStatus);

// Orders routes
router.get("/orders", deliveryController.getOrders);
router.get("/orders/:orderId", deliveryController.getOrderDetails);
router.put("/orders/:orderId/status", deliveryController.updateOrderStatus);
router.put("/orders/:orderId/pickup", deliveryController.pickupOrder);
router.put("/orders/:orderId/deliver", deliveryController.deliverOrder);
router.put("/orders/:orderId/cancel", deliveryController.cancelOrder);

// Earnings routes
router.get("/earnings", deliveryController.getEarnings);
router.get("/earnings/today", deliveryController.getTodayEarnings);
router.get("/earnings/week", deliveryController.getWeeklyEarnings);
router.get("/earnings/month", deliveryController.getMonthlyEarnings);

// Bank details routes
router.put("/bank-details", deliveryController.updateBankDetails);
router.get("/bank-details", deliveryController.getBankDetails);

// Analytics routes
router.get("/analytics", deliveryController.getAnalytics);
router.get("/analytics/performance", deliveryController.getPerformanceMetrics);

module.exports = router;
