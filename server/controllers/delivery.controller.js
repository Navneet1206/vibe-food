const { validationResult } = require("express-validator");
const DeliveryPartner = require("../models/deliveryPartner.model");
const Order = require("../models/order.model");
const { sendEmail } = require("../utils/email.service");

const deliveryController = {
  // Auth operations
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        password,
        phone,
        vehicleType,
        vehicleNumber,
        vehicleColor,
      } = req.body;

      let deliveryPartner = await DeliveryPartner.findOne({ email });
      if (deliveryPartner) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      deliveryPartner = new DeliveryPartner({
        name,
        email,
        password,
        phone,
        vehicleType,
        vehicleNumber,
        vehicleColor,
      });

      await deliveryPartner.save();

      // Generate and send verification email
      deliveryPartner.generateEmailVerificationToken();
      await deliveryPartner.save();

      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${deliveryPartner.emailVerificationToken}`;
      await sendEmail({
        to: deliveryPartner.email,
        subject: "Verify your email",
        html: `Please click <a href="${verificationUrl}">here</a> to verify your email.`,
      });

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const deliveryPartner = await DeliveryPartner.findOne({ email });
      if (!deliveryPartner) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isMatch = await deliveryPartner.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (!deliveryPartner.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      if (!deliveryPartner.isApproved) {
        return res.status(400).json({
          success: false,
          message: "Your account is pending approval",
        });
      }

      const token = await deliveryPartner.generateAuthToken();

      res.json({
        success: true,
        token,
        deliveryPartner: {
          id: deliveryPartner._id,
          name: deliveryPartner.name,
          email: deliveryPartner.email,
          phone: deliveryPartner.phone,
          vehicleType: deliveryPartner.vehicleType,
          vehicleNumber: deliveryPartner.vehicleNumber,
          isApproved: deliveryPartner.isApproved,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;

      const deliveryPartner = await DeliveryPartner.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!deliveryPartner) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification token",
        });
      }

      deliveryPartner.isEmailVerified = true;
      deliveryPartner.emailVerificationToken = undefined;
      deliveryPartner.emailVerificationExpires = undefined;
      await deliveryPartner.save();

      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Verify email error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const deliveryPartner = await DeliveryPartner.findOne({ email });
      if (!deliveryPartner) {
        return res.status(400).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      deliveryPartner.generatePasswordResetToken();
      await deliveryPartner.save();

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${deliveryPartner.resetPasswordToken}`;
      await sendEmail({
        to: deliveryPartner.email,
        subject: "Reset your password",
        html: `Please click <a href="${resetUrl}">here</a> to reset your password.`,
      });

      res.json({
        success: true,
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      const deliveryPartner = await DeliveryPartner.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!deliveryPartner) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      deliveryPartner.password = password;
      deliveryPartner.resetPasswordToken = undefined;
      deliveryPartner.resetPasswordExpires = undefined;
      await deliveryPartner.save();

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Profile operations
  getProfile: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      ).select("-password");
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      res.json({
        success: true,
        deliveryPartner,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, phone, vehicleType, vehicleNumber } = req.body;
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );

      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      deliveryPartner.name = name || deliveryPartner.name;
      deliveryPartner.phone = phone || deliveryPartner.phone;
      deliveryPartner.vehicleType = vehicleType || deliveryPartner.vehicleType;
      deliveryPartner.vehicleNumber =
        vehicleNumber || deliveryPartner.vehicleNumber;

      await deliveryPartner.save();

      res.json({
        success: true,
        deliveryPartner,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateProfilePicture: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      if (req.file) {
        deliveryPartner.profilePicture = req.file.path;
        await deliveryPartner.save();
      }

      res.json({
        success: true,
        deliveryPartner,
      });
    } catch (error) {
      console.error("Update profile picture error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateLocation: async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );

      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      await deliveryPartner.updateLocation(latitude, longitude);

      res.json({
        success: true,
        message: "Location updated successfully",
      });
    } catch (error) {
      console.error("Update location error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateAvailability: async (req, res) => {
    try {
      const { isAvailable } = req.body;
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );

      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      deliveryPartner.isAvailable = isAvailable;
      await deliveryPartner.save();

      res.json({
        success: true,
        message: "Availability updated successfully",
      });
    } catch (error) {
      console.error("Update availability error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Order operations
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find({
        deliveryPartner: req.deliveryPartner._id,
      })
        .populate("user", "name email phone")
        .populate("vendor", "name");

      res.json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        deliveryPartner: req.deliveryPartner._id,
      })
        .populate("user", "name email phone")
        .populate("vendor", "name");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Get order details error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findOne({
        _id: req.params.orderId,
        deliveryPartner: req.deliveryPartner._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      order.status = status;
      await order.save();

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  pickupOrder: async (req, res) => {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        deliveryPartner: req.deliveryPartner._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      order.status = "picked_up";
      await order.save();

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Pickup order error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  deliverOrder: async (req, res) => {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        deliveryPartner: req.deliveryPartner._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      order.status = "delivered";
      await order.save();

      // Update delivery partner statistics
      await req.deliveryPartner.updateStatistics("onTime");

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Deliver order error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        deliveryPartner: req.deliveryPartner._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      order.status = "cancelled";
      await order.save();

      // Update delivery partner statistics
      await req.deliveryPartner.updateStatistics("cancelled");

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Cancel order error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Earnings operations
  getEarnings: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      res.json({
        success: true,
        earnings: deliveryPartner.earnings,
      });
    } catch (error) {
      console.error("Get earnings error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  getDailyEarnings: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      res.json({
        success: true,
        dailyEarnings: deliveryPartner.earnings.daily,
      });
    } catch (error) {
      console.error("Get daily earnings error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  getWeeklyEarnings: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      res.json({
        success: true,
        weeklyEarnings: deliveryPartner.earnings.weekly,
      });
    } catch (error) {
      console.error("Get weekly earnings error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  getMonthlyEarnings: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      res.json({
        success: true,
        monthlyEarnings: deliveryPartner.earnings.monthly,
      });
    } catch (error) {
      console.error("Get monthly earnings error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Bank details operations
  getBankDetails: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      res.json({
        success: true,
        bankDetails: deliveryPartner.bankDetails,
      });
    } catch (error) {
      console.error("Get bank details error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateBankDetails: async (req, res) => {
    try {
      const { accountNumber, accountHolderName, bankName, ifscCode } = req.body;
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );

      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      deliveryPartner.bankDetails = {
        accountNumber,
        accountHolderName,
        bankName,
        ifscCode,
      };

      await deliveryPartner.save();

      res.json({
        success: true,
        bankDetails: deliveryPartner.bankDetails,
      });
    } catch (error) {
      console.error("Update bank details error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Analytics operations
  getAnalytics: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      res.json({
        success: true,
        analytics: {
          totalDeliveries: deliveryPartner.statistics.totalDeliveries,
          onTimeDeliveries: deliveryPartner.statistics.onTimeDeliveries,
          lateDeliveries: deliveryPartner.statistics.lateDeliveries,
          cancelledDeliveries: deliveryPartner.statistics.cancelledDeliveries,
          rating: deliveryPartner.rating,
          totalReviews: deliveryPartner.totalReviews,
        },
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  getPerformance: async (req, res) => {
    try {
      const deliveryPartner = await DeliveryPartner.findById(
        req.deliveryPartner._id
      );
      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      const onTimeRate =
        deliveryPartner.statistics.totalDeliveries > 0
          ? (deliveryPartner.statistics.onTimeDeliveries /
              deliveryPartner.statistics.totalDeliveries) *
            100
          : 0;

      res.json({
        success: true,
        performance: {
          onTimeRate,
          rating: deliveryPartner.rating,
          totalDeliveries: deliveryPartner.statistics.totalDeliveries,
          earnings: deliveryPartner.earnings,
        },
      });
    } catch (error) {
      console.error("Get performance error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

module.exports = deliveryController;
