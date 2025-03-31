const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const vendorController = require("../controllers/vendor.controller");
const {
  verifyToken,
  isVendor,
  isEmailVerified,
} = require("../middleware/auth.middleware");
const { uploadSingle, uploadMultiple } = require("../utils/cloudinary.service");

// Validation middleware
const updateProfileValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
  body("businessName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Business name cannot be empty"),
  body("businessAddress")
    .optional()
    .isObject()
    .withMessage("Business address must be an object"),
  body("businessType")
    .optional()
    .isIn(["restaurant", "cafe", "fast-food", "other"])
    .withMessage("Invalid business type"),
  body("cuisine").optional().isArray().withMessage("Cuisine must be an array"),
];

const menuItemValidation = [
  body("name").trim().notEmpty().withMessage("Item name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
];

const operatingHoursValidation = [
  body("monday")
    .optional()
    .isObject()
    .withMessage("Monday hours must be an object"),
  body("tuesday")
    .optional()
    .isObject()
    .withMessage("Tuesday hours must be an object"),
  body("wednesday")
    .optional()
    .isObject()
    .withMessage("Wednesday hours must be an object"),
  body("thursday")
    .optional()
    .isObject()
    .withMessage("Thursday hours must be an object"),
  body("friday")
    .optional()
    .isObject()
    .withMessage("Friday hours must be an object"),
  body("saturday")
    .optional()
    .isObject()
    .withMessage("Saturday hours must be an object"),
  body("sunday")
    .optional()
    .isObject()
    .withMessage("Sunday hours must be an object"),
];

// Profile routes
router.get("/profile", verifyToken, isVendor, vendorController.getProfile);
router.put(
  "/profile",
  verifyToken,
  isVendor,
  isEmailVerified,
  updateProfileValidation,
  vendorController.updateProfile
);
router.put(
  "/profile/picture",
  verifyToken,
  isVendor,
  isEmailVerified,
  uploadSingle("logo"),
  vendorController.updateLogo
);
router.put(
  "/profile/cover",
  verifyToken,
  isVendor,
  isEmailVerified,
  uploadSingle("coverImage"),
  vendorController.updateCoverImage
);
router.put(
  "/operating-hours",
  verifyToken,
  isVendor,
  isEmailVerified,
  operatingHoursValidation,
  vendorController.updateOperatingHours
);

// Menu management routes
router.get("/menu", verifyToken, isVendor, vendorController.getMenu);
router.post(
  "/menu",
  verifyToken,
  isVendor,
  isEmailVerified,
  uploadSingle("image"),
  menuItemValidation,
  vendorController.addMenuItem
);
router.put(
  "/menu/:itemId",
  verifyToken,
  isVendor,
  isEmailVerified,
  uploadSingle("image"),
  menuItemValidation,
  vendorController.updateMenuItem
);
router.delete(
  "/menu/:itemId",
  verifyToken,
  isVendor,
  isEmailVerified,
  vendorController.deleteMenuItem
);
router.put(
  "/menu/:itemId/availability",
  verifyToken,
  isVendor,
  isEmailVerified,
  vendorController.updateItemAvailability
);

// Order management routes
router.get("/orders", verifyToken, isVendor, vendorController.getOrders);
router.get(
  "/orders/:orderId",
  verifyToken,
  isVendor,
  vendorController.getOrderDetails
);
router.put(
  "/orders/:orderId/status",
  verifyToken,
  isVendor,
  vendorController.updateOrderStatus
);
router.post(
  "/orders/:orderId/reject",
  verifyToken,
  isVendor,
  vendorController.rejectOrder
);

// Analytics routes
router.get("/analytics", verifyToken, isVendor, vendorController.getAnalytics);
router.get(
  "/analytics/daily",
  verifyToken,
  isVendor,
  vendorController.getDailyAnalytics
);
router.get(
  "/analytics/weekly",
  verifyToken,
  isVendor,
  vendorController.getWeeklyAnalytics
);
router.get(
  "/analytics/monthly",
  verifyToken,
  isVendor,
  vendorController.getMonthlyAnalytics
);

// Document management routes
router.post(
  "/documents",
  verifyToken,
  isVendor,
  uploadMultiple("documents", 5),
  vendorController.uploadDocuments
);
router.delete(
  "/documents/:documentId",
  verifyToken,
  isVendor,
  vendorController.deleteDocument
);

module.exports = router;
