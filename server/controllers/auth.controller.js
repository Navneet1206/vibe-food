const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const DeliveryPartner = require("../models/delivery.model");
const { sendEmail } = require("../utils/email.service");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// User Authentication
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    user = new User({
      name,
      email,
      password,
      phone,
    });

    // Generate verification token
    user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    await sendEmail(email, "verificationEmail", user.emailVerificationToken);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    const { token } = req.params;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    user.generateEmailVerificationToken();
    await user.save();

    await sendEmail(email, "verificationEmail", user.emailVerificationToken);

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.generatePasswordResetToken();
    await user.save();

    await sendEmail(email, "passwordReset", user.resetPasswordToken);

    res.json({
      success: true,
      message: "Password reset email sent successfully",
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

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

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

// Vendor Authentication
exports.vendorRegister = async (req, res) => {
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
      businessName,
      businessAddress,
      businessType,
      cuisine,
    } = req.body;

    // Check if vendor exists
    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists",
      });
    }

    // Create vendor
    vendor = new Vendor({
      name,
      email,
      password,
      phone,
      businessName,
      businessAddress,
      businessType,
      cuisine,
      logo: req.file ? req.file.path : null,
    });

    // Generate verification token
    vendor.generateEmailVerificationToken();
    await vendor.save();

    // Send verification email
    await sendEmail(email, "verificationEmail", vendor.emailVerificationToken);

    res.status(201).json({
      success: true,
      message:
        "Vendor registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Vendor registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Similar functions for vendor login, verification, etc.
// ... (implement similar functions for vendor authentication)

// Delivery Partner Authentication
exports.deliveryRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, vehicleType, vehicleNumber } =
      req.body;

    // Check if delivery partner exists
    let deliveryPartner = await DeliveryPartner.findOne({ email });
    if (deliveryPartner) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner already exists",
      });
    }

    // Create delivery partner
    deliveryPartner = new DeliveryPartner({
      name,
      email,
      password,
      phone,
      vehicleType,
      vehicleNumber,
      profilePicture: req.file ? req.file.path : null,
    });

    // Generate verification token
    deliveryPartner.generateEmailVerificationToken();
    await deliveryPartner.save();

    // Send verification email
    await sendEmail(
      email,
      "verificationEmail",
      deliveryPartner.emailVerificationToken
    );

    res.status(201).json({
      success: true,
      message:
        "Delivery partner registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Delivery partner registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Similar functions for delivery partner login, verification, etc.
// ... (implement similar functions for delivery partner authentication)
