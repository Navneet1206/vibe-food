const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const DeliveryPartner = require("../models/DeliveryPartner");
const Order = require("../models/Order");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
  try {
    const [
      totalUsers,
      totalRestaurants,
      totalDeliveryPartners,
      totalOrders,
      recentOrders,
      revenueStats,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Restaurant.countDocuments(),
      DeliveryPartner.countDocuments(),
      Order.countDocuments(),
      Order.find()
        .populate("customer", "name")
        .populate("restaurant", "name")
        .sort({ createdAt: -1 })
        .limit(5),
      Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalRevenue: { $sum: "$total" },
            totalOrders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]),
    ]);

    const activeRestaurants = await Restaurant.countDocuments({
      status: "active",
    });
    const activeDeliveryPartners = await DeliveryPartner.countDocuments({
      status: "active",
    });
    const pendingRestaurants = await Restaurant.countDocuments({
      status: "pending",
    });
    const pendingDeliveryPartners = await DeliveryPartner.countDocuments({
      status: "pending",
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRestaurants,
        totalDeliveryPartners,
        totalOrders,
        activeRestaurants,
        activeDeliveryPartners,
        pendingRestaurants,
        pendingDeliveryPartners,
        recentOrders,
        revenueStats,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: page * 1,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin only)
router.put(
  "/users/:id/status",
  protect,
  authorize("admin"),
  [body("status").isIn(["active", "suspended"])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.status = req.body.status;
      await user.save();

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/admin/restaurants
// @desc    Get all restaurants
// @access  Private (Admin only)
router.get("/restaurants", protect, authorize("admin"), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { cuisine: { $regex: search, $options: "i" } },
      ];
    }

    const restaurants = await Restaurant.find(query)
      .populate("owner", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Restaurant.countDocuments(query);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        total,
        page: page * 1,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/admin/delivery-partners
// @desc    Get all delivery partners
// @access  Private (Admin only)
router.get(
  "/delivery-partners",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status, search, page = 1, limit = 10 } = req.query;
      const query = {};

      if (status) query.status = status;
      if (search) {
        query.$or = [
          { "vehicle.number": { $regex: search, $options: "i" } },
          { "user.name": { $regex: search, $options: "i" } },
        ];
      }

      const deliveryPartners = await DeliveryPartner.find(query)
        .populate("user", "name email phone")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await DeliveryPartner.countDocuments(query);

      res.json({
        success: true,
        data: deliveryPartners,
        pagination: {
          total,
          page: page * 1,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private (Admin only)
router.get("/orders", protect, authorize("admin"), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "restaurant.name": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate("customer", "name email phone")
      .populate("restaurant", "name")
      .populate("deliveryPartner", "user")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: page * 1,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/admin/reports
// @desc    Get platform reports
// @access  Private (Admin only)
router.get("/reports", protect, authorize("admin"), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateQuery = {};
    if (startDate && endDate) {
      dateQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const [
      revenueReport,
      orderStatusReport,
      topRestaurants,
      topDeliveryPartners,
    ] = await Promise.all([
      Order.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: "$total" },
            platformEarnings: { $sum: "$platformEarnings" },
            restaurantEarnings: { $sum: "$restaurantEarnings" },
            deliveryPartnerEarnings: { $sum: "$deliveryPartnerEarnings" },
          },
        },
      ]),
      Order.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: "$restaurant",
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
            averageRating: { $avg: "$rating" },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "restaurants",
            localField: "_id",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        { $unwind: "$restaurant" },
      ]),
      Order.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: "$deliveryPartner",
            totalDeliveries: { $sum: 1 },
            totalEarnings: { $sum: "$deliveryPartnerEarnings" },
            averageRating: { $avg: "$rating" },
          },
        },
        { $sort: { totalDeliveries: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "deliverypartners",
            localField: "_id",
            foreignField: "_id",
            as: "deliveryPartner",
          },
        },
        { $unwind: "$deliveryPartner" },
        {
          $lookup: {
            from: "users",
            localField: "deliveryPartner.user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        revenueReport: revenueReport[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          platformEarnings: 0,
          restaurantEarnings: 0,
          deliveryPartnerEarnings: 0,
        },
        orderStatusReport,
        topRestaurants,
        topDeliveryPartners,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
