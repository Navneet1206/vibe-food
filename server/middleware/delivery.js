const jwt = require("jsonwebtoken");
const DeliveryPartner = require("../models/deliveryPartner.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const deliveryPartner = await DeliveryPartner.findOne({
      _id: decoded.id,
      "tokens.token": token,
    });

    if (!deliveryPartner) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    if (!deliveryPartner.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    if (!deliveryPartner.isApproved) {
      return res.status(401).json({
        success: false,
        message: "Your account is pending approval",
      });
    }

    req.token = token;
    req.deliveryPartner = deliveryPartner;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

const isAvailable = async (req, res, next) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );

    if (!deliveryPartner.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "You are currently unavailable for deliveries",
      });
    }

    if (!deliveryPartner.isOnline) {
      return res.status(400).json({
        success: false,
        message: "You are currently offline",
      });
    }

    if (deliveryPartner.currentOrder) {
      return res.status(400).json({
        success: false,
        message: "You already have an active order",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const isApproved = async (req, res, next) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(
      req.deliveryPartner.id
    );

    if (!deliveryPartner.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  auth,
  isAvailable,
  isApproved,
};
