const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// @route   POST /api/restaurants
// @desc    Create a new restaurant
// @access  Private (Restaurant owners)
router.post(
  "/",
  protect,
  authorize("restaurant"),
  [
    body("name").notEmpty().withMessage("Restaurant name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("cuisine").notEmpty().withMessage("Cuisine type is required"),
    body("contact.phone").notEmpty().withMessage("Phone number is required"),
    body("contact.email").isEmail().withMessage("Please provide a valid email"),
    body("minimumOrder")
      .isNumeric()
      .withMessage("Minimum order must be a number"),
    body("deliveryFee")
      .isNumeric()
      .withMessage("Delivery fee must be a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user already owns a restaurant
      const existingRestaurant = await Restaurant.findOne({
        owner: req.user.id,
      });
      if (existingRestaurant) {
        return res.status(400).json({
          success: false,
          message: "You already own a restaurant",
        });
      }

      const restaurant = new Restaurant({
        ...req.body,
        owner: req.user.id,
      });

      await restaurant.save();

      res.status(201).json({
        success: true,
        data: restaurant,
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

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { status, cuisine, search, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (cuisine) query.cuisine = cuisine;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
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

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private (Restaurant owner or admin)
router.put(
  "/:id",
  protect,
  authorize("restaurant", "admin"),
  async (req, res) => {
    try {
      let restaurant = await Restaurant.findById(req.params.id);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      // Check ownership
      if (
        req.user.role !== "admin" &&
        restaurant.owner.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this restaurant",
        });
      }

      restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.json({
        success: true,
        data: restaurant,
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

// @route   PUT /api/restaurants/:id/status
// @desc    Update restaurant status
// @access  Private (Admin only)
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  [body("status").isIn(["pending", "active", "suspended", "rejected"])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const restaurant = await Restaurant.findById(req.params.id);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      await restaurant.updateStatus(req.body.status);

      res.json({
        success: true,
        data: restaurant,
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

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private (Admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
