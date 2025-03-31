const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isAuthenticated,
  isAdmin,
} = require("../middleware/auth.middleware");
const adminController = require("../controllers/admin.controller");

// Protected admin routes
router.use(verifyToken, isAuthenticated, isAdmin);

// Dashboard routes
router.get("/dashboard", adminController.getDashboard);
router.get("/users", adminController.getUsers);
router.get("/vendors", adminController.getVendors);
router.get("/delivery-partners", adminController.getDeliveryPartners);
router.get("/orders", adminController.getOrders);

// Management routes
router.put("/users/:userId/status", adminController.updateUserStatus);
router.put("/vendors/:vendorId/status", adminController.updateVendorStatus);
router.put(
  "/delivery-partners/:partnerId/status",
  adminController.updateDeliveryPartnerStatus
);

// Analytics routes
router.get("/analytics", adminController.getAnalytics);
router.get("/reports", adminController.getReports);

module.exports = router;
