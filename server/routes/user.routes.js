const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const {
  verifyToken,
  isAuthenticated,
  isEmailVerified,
} = require("../middleware/auth.middleware");
const { uploadSingle } = require("../utils/cloudinary.service");

// Validation middleware
const updateProfileValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
  body("address")
    .optional()
    .isObject()
    .withMessage("Address must be an object"),
];

const updateAddressValidation = [
  body("street").trim().notEmpty().withMessage("Street is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("zipCode").trim().notEmpty().withMessage("Zip code is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
];

// Profile routes
router.get("/profile", verifyToken, isAuthenticated, userController.getProfile);
router.put(
  "/profile",
  verifyToken,
  isAuthenticated,
  isEmailVerified,
  updateProfileValidation,
  userController.updateProfile
);
router.put(
  "/profile/picture",
  verifyToken,
  isAuthenticated,
  isEmailVerified,
  uploadSingle("profilePicture"),
  userController.updateProfilePicture
);
router.put(
  "/address",
  verifyToken,
  isAuthenticated,
  isEmailVerified,
  updateAddressValidation,
  userController.updateAddress
);

// Favorites routes
router.get(
  "/favorites",
  verifyToken,
  isAuthenticated,
  userController.getFavorites
);
router.post(
  "/favorites/:vendorId",
  verifyToken,
  isAuthenticated,
  userController.addToFavorites
);
router.delete(
  "/favorites/:vendorId",
  verifyToken,
  isAuthenticated,
  userController.removeFromFavorites
);

// Orders routes
router.get("/orders", verifyToken, isAuthenticated, userController.getOrders);
router.get(
  "/orders/:orderId",
  verifyToken,
  isAuthenticated,
  userController.getOrderDetails
);
router.post(
  "/orders/:orderId/cancel",
  verifyToken,
  isAuthenticated,
  userController.cancelOrder
);
router.post(
  "/orders/:orderId/review",
  verifyToken,
  isAuthenticated,
  userController.addOrderReview
);

// Search and browse routes
router.get("/vendors", userController.getVendors);
router.get("/vendors/:vendorId", userController.getVendorDetails);
router.get("/vendors/:vendorId/menu", userController.getVendorMenu);
router.get("/search", userController.searchVendors);

// Cart routes
router.get("/cart", verifyToken, isAuthenticated, userController.getCart);
router.post("/cart", verifyToken, isAuthenticated, userController.addToCart);
router.put(
  "/cart/:itemId",
  verifyToken,
  isAuthenticated,
  userController.updateCartItem
);
router.delete(
  "/cart/:itemId",
  verifyToken,
  isAuthenticated,
  userController.removeFromCart
);
router.post(
  "/cart/checkout",
  verifyToken,
  isAuthenticated,
  userController.checkout
);

module.exports = router;
