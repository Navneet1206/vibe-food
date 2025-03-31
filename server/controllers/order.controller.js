const Order = require("../models/order.model");
const { validationResult } = require("express-validator");

const orderController = {
  // Create a new order
  createOrder: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = new Order({
        ...req.body,
        user: req.user.id,
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all orders for the current user
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id })
        .populate("vendor", "name")
        .populate("deliveryPartner", "name")
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get order details
  getOrderDetails: async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate("vendor", "name")
        .populate("deliveryPartner", "name");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user has permission to view this order
      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user has permission to update this order
      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      order.status = status;
      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cancel order
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user has permission to cancel this order
      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Check if order can be cancelled
      if (!order.isValidStatusTransition("cancelled")) {
        return res.status(400).json({ message: "Order cannot be cancelled" });
      }

      await order.cancelOrder();
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add review to order
  addReview: async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user has permission to review this order
      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Check if order is delivered
      if (order.status !== "delivered") {
        return res
          .status(400)
          .json({ message: "Can only review delivered orders" });
      }

      await order.addReview(rating, comment);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = orderController;
