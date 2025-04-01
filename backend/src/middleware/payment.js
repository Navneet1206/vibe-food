const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = "INR" } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${Date.now()}`,
      notes: {
        orderId: req.body.orderId,
        userId: req.user.id,
      },
    });

    res.json({
      success: true,
      data: razorpayOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "confirmed",
        paymentMethod: "card",
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      });

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Handle webhook events
const handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // Verify webhook signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
      const event = req.body;

      switch (event.event) {
        case "payment.captured":
          const payment = event.payload.payment.entity;
          await Order.findOneAndUpdate(
            { "paymentDetails.razorpay_payment_id": payment.id },
            {
              paymentStatus: "paid",
              status: "confirmed",
            }
          );
          break;

        case "payment.failed":
          const failedPayment = event.payload.payment.entity;
          await Order.findOneAndUpdate(
            { "paymentDetails.razorpay_payment_id": failedPayment.id },
            {
              paymentStatus: "failed",
              status: "cancelled",
            }
          );
          break;

        default:
          console.log(`Unhandled event type ${event.event}`);
      }

      res.json({ received: true });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Refund payment
const refundPayment = async (req, res, next) => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: Math.round(amount * 100), // Convert to paise
    });

    // Update order status
    await Order.findOneAndUpdate(
      { "paymentDetails.razorpay_payment_id": paymentId },
      {
        paymentStatus: "refunded",
        status: "cancelled",
      }
    );

    res.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    next(error);
  }
};

// Create transfer to connected account
const createTransfer = async (req, res, next) => {
  try {
    const { amount, accountId } = req.body;

    const transfer = await razorpay.transfers.create({
      account: accountId,
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
    });

    res.json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  refundPayment,
  createTransfer,
};
