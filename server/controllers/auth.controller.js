const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const DeliveryPartner = require("../models/deliveryPartner.model");
const { sendEmail } = require("../utils/email.service");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const authController = {
  // User Authentication
  register: async (req, res) => {
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
        message: "Error during registration",
      });
    }
  },

  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
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
        return res.status(401).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      // Generate token
      const token = generateToken(user._id, "user");

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "user",
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Error during login",
      });
    }
  },

  logout: async (req, res) => {
    try {
      // Since we're using JWT, we don't need to do anything server-side
      // The client should remove the token from localStorage
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Error during logout",
      });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching user data",
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, phone } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.name = name || user.name;
      user.phone = phone || user.phone;

      await user.save();

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating profile",
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Error changing password",
      });
    }
  },

  forgotPassword: async (req, res) => {
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

      // Generate reset token
      user.generatePasswordResetToken();
      await user.save();

      // Send reset email
      await sendEmail(email, "resetPassword", user.resetPasswordToken);

      res.json({
        success: true,
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing forgot password request",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, password } = req.body;

      // Find user by reset token
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

      // Update password
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
        message: "Error resetting password",
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.body;

      // Find user with this verification token
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

      // Update user verification status
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        success: false,
        message: "Error verifying email",
      });
    }
  },

  // Vendor Authentication
  vendorRegister: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone, address } = req.body;
      const logo = req.file?.path;

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
        address,
        logo,
      });

      // Generate verification token
      vendor.generateEmailVerificationToken();
      await vendor.save();

      // Send verification email
      await sendEmail(
        email,
        "verificationEmail",
        vendor.emailVerificationToken
      );

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    } catch (error) {
      console.error("Vendor registration error:", error);
      res.status(500).json({
        success: false,
        message: "Error during vendor registration",
      });
    }
  },

  vendorLogin: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find vendor
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
        return res.status(401).json({
          success: false,
          message: "Please verify your email first",
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
          role: "vendor",
        },
      });
    } catch (error) {
      console.error("Vendor login error:", error);
      res.status(500).json({
        success: false,
        message: "Error during vendor login",
      });
    }
  },

  verifyVendorEmail: async (req, res) => {
    try {
      const { token } = req.params;

      const vendor = await Vendor.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!vendor) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification token",
        });
      }

      vendor.isEmailVerified = true;
      vendor.emailVerificationToken = undefined;
      vendor.emailVerificationExpires = undefined;
      await vendor.save();

      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Vendor email verification error:", error);
      res.status(500).json({
        success: false,
        message: "Error verifying vendor email",
      });
    }
  },

  resendVendorVerification: async (req, res) => {
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

      // Generate new verification token
      vendor.generateEmailVerificationToken();
      await vendor.save();

      // Send verification email
      await sendEmail(
        email,
        "verificationEmail",
        vendor.emailVerificationToken
      );

      res.json({
        success: true,
        message: "Verification email sent successfully",
      });
    } catch (error) {
      console.error("Resend vendor verification error:", error);
      res.status(500).json({
        success: false,
        message: "Error resending verification email",
      });
    }
  },

  vendorForgotPassword: async (req, res) => {
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

      // Generate reset token
      vendor.generatePasswordResetToken();
      await vendor.save();

      // Send reset email
      await sendEmail(email, "resetPassword", vendor.resetPasswordToken);

      res.json({
        success: true,
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      console.error("Vendor forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing forgot password request",
      });
    }
  },

  vendorResetPassword: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, password } = req.body;

      // Find vendor by reset token
      const vendor = await Vendor.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!vendor) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Update password
      vendor.password = password;
      vendor.resetPasswordToken = undefined;
      vendor.resetPasswordExpires = undefined;
      await vendor.save();

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Vendor reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Error resetting password",
      });
    }
  },

  // Delivery Partner Authentication
  deliveryRegister: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone, vehicleType, vehicleNumber } =
        req.body;
      const profilePicture = req.file?.path;

      // Check if delivery partner exists
      let partner = await DeliveryPartner.findOne({ email });
      if (partner) {
        return res.status(400).json({
          success: false,
          message: "Delivery partner already exists",
        });
      }

      // Create delivery partner
      partner = new DeliveryPartner({
        name,
        email,
        password,
        phone,
        vehicleType,
        vehicleNumber,
        profilePicture,
      });

      // Generate verification token
      partner.generateEmailVerificationToken();
      await partner.save();

      // Send verification email
      await sendEmail(
        email,
        "verificationEmail",
        partner.emailVerificationToken
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
        message: "Error during delivery partner registration",
      });
    }
  },

  deliveryLogin: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find delivery partner
      const partner = await DeliveryPartner.findOne({ email });
      if (!partner) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await partner.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if email is verified
      if (!partner.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      // Generate token
      const token = generateToken(partner._id, "delivery");

      res.json({
        success: true,
        token,
        partner: {
          id: partner._id,
          name: partner.name,
          email: partner.email,
          role: "delivery",
        },
      });
    } catch (error) {
      console.error("Delivery partner login error:", error);
      res.status(500).json({
        success: false,
        message: "Error during delivery partner login",
      });
    }
  },

  verifyDeliveryEmail: async (req, res) => {
    try {
      const { token } = req.params;

      const partner = await DeliveryPartner.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!partner) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification token",
        });
      }

      partner.isEmailVerified = true;
      partner.emailVerificationToken = undefined;
      partner.emailVerificationExpires = undefined;
      await partner.save();

      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Delivery partner email verification error:", error);
      res.status(500).json({
        success: false,
        message: "Error verifying delivery partner email",
      });
    }
  },

  resendDeliveryVerification: async (req, res) => {
    try {
      const { email } = req.body;
      const partner = await DeliveryPartner.findOne({ email });

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      if (partner.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: "Email is already verified",
        });
      }

      // Generate new verification token
      partner.generateEmailVerificationToken();
      await partner.save();

      // Send verification email
      await sendEmail(
        email,
        "verificationEmail",
        partner.emailVerificationToken
      );

      res.json({
        success: true,
        message: "Verification email sent successfully",
      });
    } catch (error) {
      console.error("Resend delivery partner verification error:", error);
      res.status(500).json({
        success: false,
        message: "Error resending verification email",
      });
    }
  },

  deliveryForgotPassword: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const partner = await DeliveryPartner.findOne({ email });

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      // Generate reset token
      partner.generatePasswordResetToken();
      await partner.save();

      // Send reset email
      await sendEmail(email, "resetPassword", partner.resetPasswordToken);

      res.json({
        success: true,
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      console.error("Delivery partner forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing forgot password request",
      });
    }
  },

  deliveryResetPassword: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, password } = req.body;

      // Find delivery partner by reset token
      const partner = await DeliveryPartner.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!partner) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Update password
      partner.password = password;
      partner.resetPasswordToken = undefined;
      partner.resetPasswordExpires = undefined;
      await partner.save();

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Delivery partner reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Error resetting password",
      });
    }
  },
};

module.exports = authController;
