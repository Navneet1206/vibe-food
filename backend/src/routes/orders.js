const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const DeliveryPartner = require("../models/DeliveryPartner");
const { protect, authorize } = require("../middleware/auth");

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Users)
router.post(
  "/",
  protect,
  authorize("user"),
  [
    body("restaurant").notEmpty().withMessage("Restaurant ID is required"),
    body("items").isArray().withMessage("Order items are required"),
    body("items.*.menuItem").notEmpty().withMessage("Menu item ID is required"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("deliveryAddress")
      .notEmpty()
      .withMessage("Delivery address is required"),
    body("paymentMethod")
      .isIn(["cash", "card", "upi", "wallet"])
      .withMessage("Invalid payment method"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { restaurant, items, deliveryAddress, paymentMethod } = req.body;

      // Get restaurant details
      const restaurantDoc = await Restaurant.findById(restaurant);
      if (!restaurantDoc) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      // Calculate order totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = restaurantDoc.menu.id(item.menuItem);
        if (!menuItem) {
          return res.status(404).json({
            success: false,
            message: `Menu item ${item.menuItem} not found`,
          });
        }

        if (!menuItem.isAvailable) {
          return res.status(400).json({
            success: false,
            message: `Menu item ${menuItem.name} is not available`,
          });
        }

        subtotal += menuItem.price * item.quantity;
        orderItems.push({
          menuItem: item.menuItem,
          quantity: item.quantity,
          price: menuItem.price,
          specialInstructions: item.specialInstructions,
        });
      }

      // Check minimum order amount
      if (subtotal < restaurantDoc.minimumOrder) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount is ${restaurantDoc.minimumOrder}`,
        });
      }

      const deliveryFee = restaurantDoc.deliveryFee;
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + deliveryFee + tax;

      // Create order
      const order = new Order({
        customer: req.user.id,
        restaurant,
        items: orderItems,
        subtotal,
        deliveryFee,
        tax,
        total,
        deliveryAddress,
        paymentMethod,
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
      });

      await order.save();

      // Update restaurant stats
      await restaurantDoc.updateRevenue(total);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private (Admin, Restaurant, Delivery Partner)
router.get("/", protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply filters based on user role
    if (req.user.role === "restaurant") {
      query.restaurant = req.user.restaurant;
    } else if (req.user.role === "delivery") {
      query.deliveryPartner = req.user.deliveryPartner;
    } else if (req.user.role === "user") {
      query.customer = req.user.id;
    }

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("customer", "name email phone")
      .populate("restaurant", "name")
      .populate("deliveryPartner", "user")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: page * 1,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private (Admin, Restaurant, Delivery Partner, Customer)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("restaurant", "name")
      .populate("deliveryPartner", "user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is authorized to view this order
    if (
      req.user.role !== "admin" &&
      order.customer._id.toString() !== req.user.id &&
      order.restaurant._id.toString() !== req.user.restaurant &&
      order.deliveryPartner?._id.toString() !== req.user.deliveryPartner
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin, Restaurant, Delivery Partner)
router.put(
  "/:id/status",
  protect,
  [
    body("status").isIn([
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "picked-up",
      "delivering",
      "delivered",
      "cancelled",
      "rejected",
    ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if user is authorized to update this order
      if (
        req.user.role !== "admin" &&
        order.restaurant.toString() !== req.user.restaurant &&
        order.deliveryPartner?.toString() !== req.user.deliveryPartner
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this order",
        });
      }

      await order.updateStatus(req.body.status);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   PUT /api/orders/:id/tracking
// @desc    Update order tracking
// @access  Private (Delivery Partner)
router.put(
  "/:id/tracking",
  protect,
  authorize("delivery"),
  [
    body("status").isIn(["picked-up", "delivering", "delivered"]),
    body("coordinates").isArray().withMessage("Coordinates must be an array"),
    body("coordinates").custom((value) => {
      if (value.length !== 2) {
        throw new Error("Coordinates must be [longitude, latitude]");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if delivery partner is assigned to this order
      if (order.deliveryPartner?.toString() !== req.user.deliveryPartner) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this order",
        });
      }

      await order.updateTracking(req.body.status, req.body.coordinates);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   PUT /api/orders/:id/rating
// @desc    Rate order
// @access  Private (Customer)
router.put(
  "/:id/rating",
  protect,
  authorize("user"),
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("review").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if user is the customer
      if (order.customer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to rate this order",
        });
      }

      // Check if order is delivered
      if (order.status !== "delivered") {
        return res.status(400).json({
          success: false,
          message: "Can only rate delivered orders",
        });
      }

      order.rating = req.body.rating;
      if (req.body.review) order.review = req.body.review;
      await order.save();

      // Update restaurant rating
      const restaurant = await Restaurant.findById(order.restaurant);
      await restaurant.updateRating(req.body.rating);

      // Update delivery partner rating if exists
      if (order.deliveryPartner) {
        const deliveryPartner = await DeliveryPartner.findById(
          order.deliveryPartner
        );
        await deliveryPartner.updateRating(req.body.rating);
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
