const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const Order = require("../models/order.model");
const { sendEmail } = require("../utils/email.service");

// Profile operations
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      user,
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

    const { name, phone, address } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
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
    const user = await User.findById(req.user.id);

    if (user.profilePicture) {
      // Delete old profile picture from Cloudinary
      await cloudinary.uploader.destroy(user.profilePicture);
    }

    user.profilePicture = req.file.path;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    user.address = req.body;
    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      address: user.address,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Favorites operations
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const vendor = await Vendor.findById(req.params.vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (user.favorites.includes(vendor._id)) {
      return res.status(400).json({
        success: false,
        message: "Vendor already in favorites",
      });
    }

    user.favorites.push(vendor._id);
    await user.save();

    res.json({
      success: true,
      message: "Vendor added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.vendorId
    );
    await user.save();

    res.json({
      success: true,
      message: "Vendor removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Orders operations
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("vendor", "businessName")
      .populate("deliveryPartner", "name")
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
      user: req.user.id,
    })
      .populate("vendor", "businessName")
      .populate("deliveryPartner", "name");

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

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    await order.cancelOrder("Order cancelled by user", "user");

    // Send notification to vendor
    await sendEmail(order.vendor.email, "orderStatusUpdate", order);

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

exports.addOrderReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
      status: "delivered",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not delivered",
      });
    }

    await order.addReview(rating, review);

    // Update vendor rating
    const vendor = await Vendor.findById(order.vendor);
    vendor.rating =
      (vendor.rating * vendor.totalReviews + rating) /
      (vendor.totalReviews + 1);
    vendor.totalReviews += 1;
    await vendor.save();

    res.json({
      success: true,
      message: "Review added successfully",
      order,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Search and browse operations
exports.getVendors = async (req, res) => {
  try {
    const { page = 1, limit = 10, cuisine, rating } = req.query;
    const query = { isActive: true, isApproved: true };

    if (cuisine) query.cuisine = cuisine;
    if (rating) query.rating = { $gte: parseFloat(rating) };

    const vendors = await Vendor.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Vendor.countDocuments(query);

    res.json({
      success: true,
      vendors,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get vendors error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getVendorDetails = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId).select(
      "-password"
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("Get vendor details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getVendorMenu = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId).select("menu");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      menu: vendor.menu,
    });
  } catch (error) {
    console.error("Get vendor menu error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.searchVendors = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const searchQuery = {
      isActive: true,
      isApproved: true,
      $or: [
        { businessName: { $regex: query, $options: "i" } },
        { cuisine: { $regex: query, $options: "i" } },
      ],
    };

    const vendors = await Vendor.find(searchQuery)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Vendor.countDocuments(searchQuery);

    res.json({
      success: true,
      vendors,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Search vendors error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
