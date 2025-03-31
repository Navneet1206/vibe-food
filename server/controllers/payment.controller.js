const paymentService = require("../services/payment.service");
const Order = require("../models/order.model");

const paymentController = {
  createPaymentOrder: async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const razorpayOrder = await paymentService.createOrder(order.totalAmount);

      res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment order" });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
      } = req.body;

      const isValid = paymentService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        paymentId: razorpay_payment_id,
        status: "confirmed",
      });

      res.json({ message: "Payment verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify payment" });
    }
  },

  refundPayment: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.paymentStatus !== "paid") {
        return res.status(400).json({ message: "Order is not paid" });
      }

      const refund = await paymentService.refundPayment(
        order.paymentId,
        order.totalAmount
      );

      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "refunded",
        status: "cancelled",
      });

      res.json({ message: "Refund processed successfully", refund });
    } catch (error) {
      res.status(500).json({ message: "Failed to process refund" });
    }
  },
};

module.exports = paymentController;
