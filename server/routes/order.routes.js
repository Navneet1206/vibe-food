const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isAuthenticated,
} = require("../middleware/auth.middleware");
const orderController = require("../controllers/order.controller");
const { body } = require("express-validator");

// Validation middleware
const orderValidation = [
  body("items").isArray().withMessage("Items are required"),
  body("items.*.item").notEmpty().withMessage("Item is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("deliveryAddress")
    .notEmpty()
    .withMessage("Delivery address is required"),
  body("paymentMethod")
    .isIn(["cash", "card"])
    .withMessage("Invalid payment method"),
];

// Protected routes
router.use(verifyToken, isAuthenticated);

// Order routes
router.post("/", orderValidation, orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:orderId", orderController.getOrderDetails);
router.put("/:orderId/status", orderController.updateOrderStatus);
router.put("/:orderId/cancel", orderController.cancelOrder);
router.post("/:orderId/review", orderController.addReview);

module.exports = router;
