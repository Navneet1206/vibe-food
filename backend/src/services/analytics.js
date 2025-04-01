const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const DeliveryPartner = require("../models/DeliveryPartner");

// Get platform overview statistics
const getPlatformOverview = async (startDate, endDate) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalRestaurants,
      totalDeliveryPartners,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      User.countDocuments({ role: "customer" }),
      Restaurant.countDocuments(),
      DeliveryPartner.countDocuments(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customer", "name email")
        .populate("restaurant", "name")
        .populate("deliveryPartner", "name"),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalRestaurants,
      totalDeliveryPartners,
      recentOrders,
    };
  } catch (error) {
    console.error("Analytics error:", error);
    throw error;
  }
};

// Get restaurant performance metrics
const getRestaurantMetrics = async (restaurantId, startDate, endDate) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      averageRating,
      popularItems,
      orderStatusDistribution,
    ] = await Promise.all([
      Order.countDocuments({
        restaurant: restaurantId,
        createdAt: { $gte: startDate, $lte: endDate },
      }),
      Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: { $gte: startDate, $lte: endDate },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: { $gte: startDate, $lte: endDate },
            rating: { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$rating" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: "$items.menuItem",
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $limit: 5,
        },
      ]),
      Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageRating: averageRating[0]?.average || 0,
      popularItems,
      orderStatusDistribution,
    };
  } catch (error) {
    console.error("Restaurant analytics error:", error);
    throw error;
  }
};

// Get delivery partner performance metrics
const getDeliveryPartnerMetrics = async (
  deliveryPartnerId,
  startDate,
  endDate
) => {
  try {
    const [
      totalDeliveries,
      totalEarnings,
      averageRating,
      averageDeliveryTime,
      orderStatusDistribution,
    ] = await Promise.all([
      Order.countDocuments({
        deliveryPartner: deliveryPartnerId,
        createdAt: { $gte: startDate, $lte: endDate },
      }),
      Order.aggregate([
        {
          $match: {
            deliveryPartner: deliveryPartnerId,
            createdAt: { $gte: startDate, $lte: endDate },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$deliveryPartnerEarnings" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            deliveryPartner: deliveryPartnerId,
            createdAt: { $gte: startDate, $lte: endDate },
            rating: { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$rating" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            deliveryPartner: deliveryPartnerId,
            createdAt: { $gte: startDate, $lte: endDate },
            status: "delivered",
            actualDeliveryTime: { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$actualDeliveryTime" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            deliveryPartner: deliveryPartnerId,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      totalDeliveries,
      totalEarnings: totalEarnings[0]?.total || 0,
      averageRating: averageRating[0]?.average || 0,
      averageDeliveryTime: averageDeliveryTime[0]?.average || 0,
      orderStatusDistribution,
    };
  } catch (error) {
    console.error("Delivery partner analytics error:", error);
    throw error;
  }
};

// Get customer analytics
const getCustomerAnalytics = async (customerId, startDate, endDate) => {
  try {
    const [totalOrders, totalSpent, favoriteRestaurants, orderHistory] =
      await Promise.all([
        Order.countDocuments({
          customer: customerId,
          createdAt: { $gte: startDate, $lte: endDate },
        }),
        Order.aggregate([
          {
            $match: {
              customer: customerId,
              createdAt: { $gte: startDate, $lte: endDate },
              status: "delivered",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: {
              customer: customerId,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: "$restaurant",
              orderCount: { $sum: 1 },
            },
          },
          {
            $sort: { orderCount: -1 },
          },
          {
            $limit: 5,
          },
        ]),
        Order.find({
          customer: customerId,
          createdAt: { $gte: startDate, $lte: endDate },
        })
          .sort({ createdAt: -1 })
          .populate("restaurant", "name")
          .populate("deliveryPartner", "name"),
      ]);

    return {
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      favoriteRestaurants,
      orderHistory,
    };
  } catch (error) {
    console.error("Customer analytics error:", error);
    throw error;
  }
};

module.exports = {
  getPlatformOverview,
  getRestaurantMetrics,
  getDeliveryPartnerMetrics,
  getCustomerAnalytics,
};
