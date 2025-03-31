const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const DeliveryPartner = require("../models/deliveryPartner.model");

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Access token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Check if user is vendor
const isVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.user.id);
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Vendor not found",
      });
    }
    if (!vendor.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Vendor account not approved",
      });
    }
    req.vendor = vendor;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Check if user is delivery partner
const isDeliveryPartner = async (req, res, next) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(req.user.id);
    if (!deliveryPartner) {
      return res.status(401).json({
        success: false,
        message: "Delivery partner not found",
      });
    }
    if (!deliveryPartner.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Delivery partner account not approved",
      });
    }
    req.deliveryPartner = deliveryPartner;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Check if email is verified
const isEmailVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email address",
    });
  }
  next();
};

// Role-based access control middleware
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient privileges.",
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  isAuthenticated,
  isAdmin,
  isVendor,
  isDeliveryPartner,
  isEmailVerified,
  checkRole,
};
