const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const DeliveryPartner = require("../models/deliveryPartner.model");
const Order = require("../models/order.model");

const adminController = {
  // Get dashboard data
  getDashboard: async (req, res) => {
    try {
      const [
        totalUsers,
        totalVendors,
        totalDeliveryPartners,
        totalOrders,
        recentOrders,
      ] = await Promise.all([
        User.countDocuments(),
        Vendor.countDocuments(),
        DeliveryPartner.countDocuments(),
        Order.countDocuments(),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("user", "name")
          .populate("vendor", "name"),
      ]);

      res.json({
        totalUsers,
        totalVendors,
        totalDeliveryPartners,
        totalOrders,
        recentOrders,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all users
  getUsers: async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all vendors
  getVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find()
        .select("-password")
        .sort({ createdAt: -1 });
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all delivery partners
  getDeliveryPartners: async (req, res) => {
    try {
      const partners = await DeliveryPartner.find()
        .select("-password")
        .sort({ createdAt: -1 });
      res.json(partners);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all orders
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name")
        .populate("vendor", "name")
        .populate("deliveryPartner", "name")
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user status
  updateUserStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isActive = status;
      await user.save();

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update vendor status
  updateVendorStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const vendor = await Vendor.findById(req.params.vendorId);

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      vendor.isActive = status;
      await vendor.save();

      res.json(vendor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update delivery partner status
  updateDeliveryPartnerStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const partner = await DeliveryPartner.findById(req.params.partnerId);

      if (!partner) {
        return res.status(404).json({ message: "Delivery partner not found" });
      }

      partner.isActive = status;
      await partner.save();

      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get analytics
  getAnalytics: async (req, res) => {
    try {
      const [
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topVendors,
        topDeliveryPartners,
      ] = await Promise.all([
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Order.countDocuments({ status: "delivered" }),
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: null, average: { $avg: "$totalAmount" } } },
        ]),
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: "$vendor", total: { $sum: "$totalAmount" } } },
          { $sort: { total: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "vendors",
              localField: "_id",
              foreignField: "_id",
              as: "vendor",
            },
          },
        ]),
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: "$deliveryPartner", total: { $sum: 1 } } },
          { $sort: { total: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "deliverypartners",
              localField: "_id",
              foreignField: "_id",
              as: "partner",
            },
          },
        ]),
      ]);

      res.json({
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        averageOrderValue: averageOrderValue[0]?.average || 0,
        topVendors,
        topDeliveryPartners,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get reports
  getReports: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const query = {};

      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const orders = await Order.find(query)
        .populate("user", "name")
        .populate("vendor", "name")
        .populate("deliveryPartner", "name")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = adminController;
