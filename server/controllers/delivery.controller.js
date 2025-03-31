const { validationResult } = require("express-validator");
const DeliveryPartner = require("../models/deliveryPartner.model");
const Order = require("../models/order.model");
const { sendEmail } = require("../utils/email.service");

// Auth operations
exports.register = async (req, res) => {
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
};

exports.login = async (req, res) => {
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

    const token = deliveryPartner.generateAuthToken();

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
        isAvailable: deliveryPartner.isAvailable,
        isOnline: deliveryPartner.isOnline,
        rating: deliveryPartner.rating,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findOne({
      emailVerificationToken: req.params.token,
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
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return res.status(404).json({
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
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.resetPassword = async (req, res) => {
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
};

// Profile operations
exports.getProfile = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    ).select("-password");
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
};

exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, vehicleType, vehicleNumber, vehicleColor } = req.body;
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );

    if (name) deliveryPartner.name = name;
    if (phone) deliveryPartner.phone = phone;
    if (vehicleType) deliveryPartner.vehicleType = vehicleType;
    if (vehicleNumber) deliveryPartner.vehicleNumber = vehicleNumber;
    if (vehicleColor) deliveryPartner.vehicleColor = vehicleColor;

    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      deliveryPartner,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
    deliveryPartner.profilePicture = req.file.path;
    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      deliveryPartner,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );

    deliveryPartner.currentLocation.coordinates = coordinates;
    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Location updated successfully",
      deliveryPartner,
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );

    deliveryPartner.isAvailable = isAvailable;
    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Availability updated successfully",
      deliveryPartner,
    });
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );

    deliveryPartner.isOnline = isOnline;
    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Online status updated successfully",
      deliveryPartner,
    });
  } catch (error) {
    console.error("Update online status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Orders operations
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.deliveryPartner.id })
      .populate("user vendor")
      .sort({ createdAt: -1 });

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
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryPartner: req.deliveryPartner.id,
    }).populate("user vendor");

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
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryPartner: req.deliveryPartner.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updateStatus(status);
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.pickupOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryPartner: req.deliveryPartner.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updateStatus("picked_up");
    await order.save();

    res.json({
      success: true,
      message: "Order picked up successfully",
      order,
    });
  } catch (error) {
    console.error("Pickup order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deliverOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryPartner: req.deliveryPartner.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updateStatus("delivered");
    await order.save();

    // Update delivery partner stats
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
    await deliveryPartner.completeOrder();
    await deliveryPartner.updateEarnings(order.deliveryFee);

    res.json({
      success: true,
      message: "Order delivered successfully",
      order,
    });
  } catch (error) {
    console.error("Deliver order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryPartner: req.deliveryPartner.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.cancelOrder(reason, "delivery_partner");
    await order.save();

    // Update delivery partner stats
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
    await deliveryPartner.cancelOrder();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Earnings operations
exports.getEarnings = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
    res.json({
      success: true,
      earnings: {
        total: deliveryPartner.totalEarnings,
        today: deliveryPartner.todayEarnings,
      },
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getTodayEarnings = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
    res.json({
      success: true,
      earnings: deliveryPartner.todayEarnings,
    });
  } catch (error) {
    console.error("Get today earnings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getWeeklyEarnings = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      deliveryPartner: req.deliveryPartner.id,
      status: "delivered",
      createdAt: { $gte: startOfWeek },
    });

    const earnings = orders.reduce(
      (total, order) => total + order.deliveryFee,
      0
    );

    res.json({
      success: true,
      earnings,
    });
  } catch (error) {
    console.error("Get weekly earnings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getMonthlyEarnings = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      deliveryPartner: req.deliveryPartner.id,
      status: "delivered",
      createdAt: { $gte: startOfMonth },
    });

    const earnings = orders.reduce(
      (total, order) => total + order.deliveryFee,
      0
    );

    res.json({
      success: true,
      earnings,
    });
  } catch (error) {
    console.error("Get monthly earnings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Bank details operations
exports.updateBankDetails = async (req, res) => {
  try {
    const { accountNumber, accountHolderName, bankName, ifscCode } = req.body;
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );

    deliveryPartner.bankDetails = {
      accountNumber,
      accountHolderName,
      bankName,
      ifscCode,
    };

    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Bank details updated successfully",
      deliveryPartner,
    });
  } catch (error) {
    console.error("Update bank details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getBankDetails = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
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
};

// Analytics operations
exports.getAnalytics = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
    res.json({
      success: true,
      analytics: {
        totalDeliveries: deliveryPartner.totalDeliveries,
        completedDeliveries: deliveryPartner.completedDeliveries,
        cancelledDeliveries: deliveryPartner.cancelledDeliveries,
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
};

exports.getPerformanceMetrics = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );
    const orders = await Order.find({
      deliveryPartner: req.deliveryPartner.id,
      status: "delivered",
    });

    const averageDeliveryTime =
      orders.reduce((total, order) => {
        const deliveryTime = order.actualDeliveryTime - order.createdAt;
        return total + deliveryTime;
      }, 0) / orders.length;

    res.json({
      success: true,
      metrics: {
        averageDeliveryTime,
        completionRate:
          (deliveryPartner.completedDeliveries /
            deliveryPartner.totalDeliveries) *
          100,
        cancellationRate:
          (deliveryPartner.cancelledDeliveries /
            deliveryPartner.totalDeliveries) *
          100,
      },
    });
  } catch (error) {
    console.error("Get performance metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
