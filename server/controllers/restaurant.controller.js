const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menuItem.model");

const restaurantController = {
  // Get all restaurants
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.find({ isActive: true })
        .select(
          "name description cuisine rating image coverImage address deliveryTime minOrder"
        )
        .sort({ rating: -1 });

      res.json(restaurants);
    } catch (error) {
      console.error("Get restaurants error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch restaurants",
      });
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id)
        .select("-password")
        .populate("menu", "name description price image category isVeg");

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      res.json(restaurant);
    } catch (error) {
      console.error("Get restaurant error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch restaurant details",
      });
    }
  },

  // Get all menu items
  getAllMenuItems: async (req, res) => {
    try {
      const menuItems = await MenuItem.find({ isActive: true })
        .populate("restaurantId", "name")
        .select("name description price image category isVeg restaurantId");

      res.json(menuItems);
    } catch (error) {
      console.error("Get menu items error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch menu items",
      });
    }
  },

  // Get menu items by restaurant
  getMenuItemsByRestaurant: async (req, res) => {
    try {
      const menuItems = await MenuItem.find({
        restaurantId: req.params.restaurantId,
        isActive: true,
      }).select("name description price image category isVeg");

      res.json(menuItems);
    } catch (error) {
      console.error("Get restaurant menu error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch restaurant menu",
      });
    }
  },

  // Create restaurant (admin only)
  createRestaurant: async (req, res) => {
    try {
      const {
        name,
        description,
        cuisine,
        address,
        phone,
        email,
        openingHours,
        minimumOrder,
        deliveryFee,
      } = req.body;

      const restaurant = new Restaurant({
        name,
        description,
        cuisine,
        address,
        phone,
        email,
        openingHours,
        minimumOrder,
        deliveryFee,
      });

      await restaurant.save();

      res.status(201).json({
        success: true,
        restaurant,
      });
    } catch (error) {
      console.error("Create restaurant error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Update restaurant (admin only)
  updateRestaurant: async (req, res) => {
    try {
      const {
        name,
        description,
        cuisine,
        address,
        phone,
        email,
        openingHours,
        minimumOrder,
        deliveryFee,
        isActive,
      } = req.body;

      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      restaurant.name = name || restaurant.name;
      restaurant.description = description || restaurant.description;
      restaurant.cuisine = cuisine || restaurant.cuisine;
      restaurant.address = address || restaurant.address;
      restaurant.phone = phone || restaurant.phone;
      restaurant.email = email || restaurant.email;
      restaurant.openingHours = openingHours || restaurant.openingHours;
      restaurant.minimumOrder = minimumOrder || restaurant.minimumOrder;
      restaurant.deliveryFee = deliveryFee || restaurant.deliveryFee;
      if (typeof isActive === "boolean") {
        restaurant.isActive = isActive;
      }

      await restaurant.save();

      res.json({
        success: true,
        restaurant,
      });
    } catch (error) {
      console.error("Update restaurant error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Delete restaurant (admin only)
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      await restaurant.remove();

      res.json({
        success: true,
        message: "Restaurant deleted successfully",
      });
    } catch (error) {
      console.error("Delete restaurant error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

module.exports = restaurantController;
