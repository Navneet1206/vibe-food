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
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const user = await User.findById(req.user.id);
    user.profilePicture = req.file.path;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      user,
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
      user,
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
    const vendorId = req.params.vendorId;

    if (user.favorites.includes(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Vendor already in favorites",
      });
    }

    user.favorites.push(vendorId);
    await user.save();

    res.json({
      success: true,
      message: "Vendor added to favorites",
      user,
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
    const vendorId = req.params.vendorId;

    user.favorites = user.favorites.filter((id) => id.toString() !== vendorId);
    await user.save();

    res.json({
      success: true,
      message: "Vendor removed from favorites",
      user,
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
      .populate("vendor")
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
    }).populate("vendor");

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

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

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
    const { rating, comment } = req.body;
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

    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Can only review delivered orders",
      });
    }

    order.review = { rating, comment };
    await order.save();

    res.json({
      success: true,
      message: "Review added successfully",
      order,
    });
  } catch (error) {
    console.error("Add order review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Search and browse operations
exports.getVendors = async (req, res) => {
  try {
    const { page = 1, limit = 10, cuisine, sort } = req.query;
    const query = {};

    if (cuisine) {
      query.cuisine = cuisine;
    }

    const vendors = await Vendor.find(query)
      .sort(sort === "rating" ? { rating: -1 } : { name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

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
    const vendor = await Vendor.findById(req.params.vendorId);
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
    const vendor = await Vendor.findById(req.params.vendorId);
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
    const { query, cuisine, sort } = req.query;
    const searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { cuisine: { $regex: query, $options: "i" } },
      ];
    }

    if (cuisine) {
      searchQuery.cuisine = cuisine;
    }

    const vendors = await Vendor.find(searchQuery).sort(
      sort === "rating" ? { rating: -1 } : { name: 1 }
    );

    res.json({
      success: true,
      vendors,
    });
  } catch (error) {
    console.error("Search vendors error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Cart operations
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.items.vendor");
    res.json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { vendorId, itemId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const menuItem = vendor.menu.id(itemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    user.addToCart(vendorId, itemId, quantity);
    await user.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    user.updateCartItem(req.params.itemId, quantity);
    await user.save();

    res.json({
      success: true,
      message: "Cart item updated",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.removeFromCart(req.params.itemId);
    await user.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.checkout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.items.vendor");
    const { deliveryAddress, paymentMethod } = req.body;

    if (!user.cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const order = await Order.create({
      user: user._id,
      items: user.cart.items,
      deliveryAddress,
      paymentMethod,
      totalAmount: user.cart.totalAmount,
    });

    // Clear cart
    user.cart.items = [];
    await user.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
