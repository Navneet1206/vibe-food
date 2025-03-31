const { validationResult } = require("express-validator");
const Vendor = require("../models/vendor.model");
const Order = require("../models/order.model");
const { sendEmail } = require("../utils/email.service");
const { cloudinary } = require("../utils/cloudinary.service");

// Profile operations
exports.getProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select("-password");
    res.json({
      success: true,
      vendor,
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

    const vendor = await Vendor.findById(req.vendor.id);
    const updateFields = [
      "name",
      "phone",
      "businessName",
      "businessAddress",
      "businessType",
      "cuisine",
    ];

    updateFields.forEach((field) => {
      if (req.body[field]) {
        vendor[field] = req.body[field];
      }
    });

    await vendor.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      vendor,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateLogo = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);

    if (vendor.logo) {
      // Delete old logo from Cloudinary
      await cloudinary.uploader.destroy(vendor.logo);
    }

    vendor.logo = req.file.path;
    await vendor.save();

    res.json({
      success: true,
      message: "Logo updated successfully",
      logo: vendor.logo,
    });
  } catch (error) {
    console.error("Update logo error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateCoverImage = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);

    if (vendor.coverImage) {
      // Delete old cover image from Cloudinary
      await cloudinary.uploader.destroy(vendor.coverImage);
    }

    vendor.coverImage = req.file.path;
    await vendor.save();

    res.json({
      success: true,
      message: "Cover image updated successfully",
      coverImage: vendor.coverImage,
    });
  } catch (error) {
    console.error("Update cover image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateOperatingHours = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = await Vendor.findById(req.vendor.id);
    vendor.operatingHours = req.body;
    await vendor.save();

    res.json({
      success: true,
      message: "Operating hours updated successfully",
      operatingHours: vendor.operatingHours,
    });
  } catch (error) {
    console.error("Update operating hours error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Menu management operations
exports.getMenu = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select("menu");
    res.json({
      success: true,
      menu: vendor.menu,
    });
  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = await Vendor.findById(req.vendor.id);
    const menuItem = {
      ...req.body,
      image: req.file ? req.file.path : null,
    };

    vendor.menu.push(menuItem);
    await vendor.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menuItem: vendor.menu[vendor.menu.length - 1],
    });
  } catch (error) {
    console.error("Add menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = await Vendor.findById(req.vendor.id);
    const menuItem = vendor.menu.id(req.params.itemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (req.file) {
      if (menuItem.image) {
        await cloudinary.uploader.destroy(menuItem.image);
      }
      menuItem.image = req.file.path;
    }

    Object.assign(menuItem, req.body);
    await vendor.save();

    res.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    const menuItem = vendor.menu.id(req.params.itemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (menuItem.image) {
      await cloudinary.uploader.destroy(menuItem.image);
    }

    menuItem.remove();
    await vendor.save();

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateItemAvailability = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    const menuItem = vendor.menu.id(req.params.itemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await vendor.save();

    res.json({
      success: true,
      message: "Item availability updated successfully",
      isAvailable: menuItem.isAvailable,
    });
  } catch (error) {
    console.error("Update item availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Order management operations
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.vendor.id })
      .populate("user", "name email")
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
      vendor: req.vendor.id,
    })
      .populate("user", "name email")
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.orderId,
      vendor: req.vendor.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updateStatus(status);

    // Send notification to user
    await sendEmail(order.user.email, "orderStatusUpdate", order);

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

exports.rejectOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({
      _id: req.params.orderId,
      vendor: req.vendor.id,
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
        message: "Order cannot be rejected at this stage",
      });
    }

    await order.cancelOrder(reason, "vendor");

    // Send notification to user
    await sendEmail(order.user.email, "orderStatusUpdate", order);

    res.json({
      success: true,
      message: "Order rejected successfully",
      order,
    });
  } catch (error) {
    console.error("Reject order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Analytics operations
exports.getAnalytics = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    res.json({
      success: true,
      analytics: vendor.analytics,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getDailyAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      vendor: req.vendor.id,
      createdAt: { $gte: today },
    });

    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.finalAmount, 0),
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.finalAmount, 0) /
            orders.length
          : 0,
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Get daily analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      vendor: req.vendor.id,
      createdAt: { $gte: weekStart },
    });

    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.finalAmount, 0),
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.finalAmount, 0) /
            orders.length
          : 0,
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Get weekly analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      vendor: req.vendor.id,
      createdAt: { $gte: monthStart },
    });

    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.finalAmount, 0),
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.finalAmount, 0) /
            orders.length
          : 0,
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Get monthly analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Document management operations
exports.uploadDocuments = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    const documents = req.files.map((file) => file.path);
    vendor.documents.push(...documents);
    await vendor.save();

    res.json({
      success: true,
      message: "Documents uploaded successfully",
      documents: vendor.documents,
    });
  } catch (error) {
    console.error("Upload documents error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    const document = vendor.documents.find(
      (doc) => doc === req.params.documentId
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    await cloudinary.uploader.destroy(document);
    vendor.documents = vendor.documents.filter((doc) => doc !== document);
    await vendor.save();

    res.json({
      success: true,
      message: "Document deleted successfully",
      documents: vendor.documents,
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
