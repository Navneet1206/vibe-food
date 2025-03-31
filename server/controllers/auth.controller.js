const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const DeliveryPartner = require("../models/delivery.model");
const { sendEmail } = require("../utils/email.service");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
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
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    await sendEmail(email, "resetPassword", user.passwordResetToken);

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
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

    const { name, email, password, phone, cuisine, address } = req.body;
    const logo = req.file ? req.file.path : undefined;

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
      cuisine,
      address,
      logo,
    });

    // Generate verification token
    vendor.generateEmailVerificationToken();
    await vendor.save();

    // Send verification email
    await sendEmail(email, "verificationEmail", vendor.emailVerificationToken);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Vendor registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.vendorLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if vendor exists
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await vendor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!vendor.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address",
      });
    }

    // Generate token
    const token = generateToken(vendor._id, "vendor");

    res.json({
      success: true,
      token,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        cuisine: vendor.cuisine,
        logo: vendor.logo,
      },
    });
  } catch (error) {
    console.error("Vendor login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.verifyVendorEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const vendor = await Vendor.findOne({ emailVerificationToken: token });

    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    vendor.isEmailVerified = true;
    vendor.emailVerificationToken = undefined;
    await vendor.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Vendor email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.resendVendorVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    vendor.generateEmailVerificationToken();
    await vendor.save();

    await sendEmail(email, "verificationEmail", vendor.emailVerificationToken);

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend vendor verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.vendorForgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.generatePasswordResetToken();
    await vendor.save();

    await sendEmail(email, "resetPassword", vendor.passwordResetToken);

    res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Vendor forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.vendorResetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;
    const vendor = await Vendor.findOne({ passwordResetToken: token });

    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    vendor.password = password;
    vendor.passwordResetToken = undefined;
    await vendor.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Vendor reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delivery Partner Authentication
exports.deliveryRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;
    const profilePicture = req.file ? req.file.path : undefined;

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
      profilePicture,
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
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Delivery partner registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deliveryLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if delivery partner exists
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await deliveryPartner.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!deliveryPartner.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address",
      });
    }

    // Generate token
    const token = generateToken(deliveryPartner._id, "delivery");

    res.json({
      success: true,
      token,
      deliveryPartner: {
        id: deliveryPartner._id,
        name: deliveryPartner.name,
        email: deliveryPartner.email,
        profilePicture: deliveryPartner.profilePicture,
      },
    });
  } catch (error) {
    console.error("Delivery partner login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.verifyDeliveryEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const deliveryPartner = await DeliveryPartner.findOne({
      emailVerificationToken: token,
    });

    if (!deliveryPartner) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    deliveryPartner.isEmailVerified = true;
    deliveryPartner.emailVerificationToken = undefined;
    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Delivery partner email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.resendDeliveryVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    if (deliveryPartner.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    deliveryPartner.generateEmailVerificationToken();
    await deliveryPartner.save();

    await sendEmail(
      email,
      "verificationEmail",
      deliveryPartner.emailVerificationToken
    );

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend delivery partner verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deliveryForgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    await sendEmail(email, "resetPassword", deliveryPartner.passwordResetToken);

    res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Delivery partner forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deliveryResetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({
      passwordResetToken: token,
    });

    if (!deliveryPartner) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    deliveryPartner.password = password;
    deliveryPartner.passwordResetToken = undefined;
    await deliveryPartner.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Delivery partner reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
