const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const DeliveryPartner = require("../models/DeliveryPartner");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// @route   POST /api/delivery-partners
// @desc    Create a new delivery partner
// @access  Private (Delivery partners)
router.post(
  "/",
  protect,
  authorize("delivery"),
  [
    body("vehicle.type")
      .isIn(["bicycle", "motorcycle", "car", "scooter", "bike"])
      .withMessage("Invalid vehicle type"),
    body("vehicle.number").notEmpty().withMessage("Vehicle number is required"),
    body("documents.drivingLicense")
      .notEmpty()
      .withMessage("Driving license is required"),
    body("documents.vehicleRegistration")
      .notEmpty()
      .withMessage("Vehicle registration is required"),
    body("documents.insurance")
      .notEmpty()
      .withMessage("Insurance document is required"),
    body("workingHours.start")
      .notEmpty()
      .withMessage("Working hours start time is required"),
    body("workingHours.end")
      .notEmpty()
      .withMessage("Working hours end time is required"),
    body("workingHours.days")
      .isArray()
      .withMessage("Working days must be an array"),
    body("bankDetails.accountNumber")
      .notEmpty()
      .withMessage("Bank account number is required"),
    body("bankDetails.accountHolderName")
      .notEmpty()
      .withMessage("Account holder name is required"),
    body("bankDetails.bankName")
      .notEmpty()
      .withMessage("Bank name is required"),
    body("bankDetails.ifscCode")
      .notEmpty()
      .withMessage("IFSC code is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is already a delivery partner
      const existingPartner = await DeliveryPartner.findOne({
        user: req.user.id,
      });
      if (existingPartner) {
        return res.status(400).json({
          success: false,
          message: "You are already registered as a delivery partner",
        });
      }

      const deliveryPartner = new DeliveryPartner({
        ...req.body,
        user: req.user.id,
      });

      await deliveryPartner.save();

      res.status(201).json({
        success: true,
        data: deliveryPartner,
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

// @route   GET /api/delivery-partners
// @desc    Get all delivery partners
// @access  Private (Admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { "vehicle.number": { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
      ];
    }

    const deliveryPartners = await DeliveryPartner.find(query)
      .populate("user", "name email phone")
      .populate("currentOrder", "orderNumber status")
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
});

// @route   GET /api/delivery-partners/:id
// @desc    Get delivery partner by ID
// @access  Private (Admin or self)
router.get("/:id", protect, async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("currentOrder", "orderNumber status");

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    // Check if user is authorized to view this partner
    if (
      req.user.role !== "admin" &&
      deliveryPartner.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this delivery partner",
      });
    }

    res.json({
      success: true,
      data: deliveryPartner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/delivery-partners/:id
// @desc    Update delivery partner
// @access  Private (Admin or self)
router.put("/:id", protect, async (req, res) => {
  try {
    let deliveryPartner = await DeliveryPartner.findById(req.params.id);

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    // Check if user is authorized to update this partner
    if (
      req.user.role !== "admin" &&
      deliveryPartner.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this delivery partner",
      });
    }

    deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: deliveryPartner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/delivery-partners/:id/status
// @desc    Update delivery partner status
// @access  Private (Admin only)
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  [body("status").isIn(["pending", "active", "suspended", "offline"])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deliveryPartner = await DeliveryPartner.findById(req.params.id);

      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      await deliveryPartner.updateStatus(req.body.status);

      res.json({
        success: true,
        data: deliveryPartner,
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

// @route   PUT /api/delivery-partners/:id/location
// @desc    Update delivery partner location
// @access  Private (Delivery partner only)
router.put(
  "/:id/location",
  protect,
  authorize("delivery"),
  [
    body("coordinates").isArray().withMessage("Coordinates must be an array"),
    body("coordinates").custom((value) => {
      if (value.length !== 2) {
        throw new Error("Coordinates must be [longitude, latitude]");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deliveryPartner = await DeliveryPartner.findOne({
        user: req.user.id,
      });

      if (!deliveryPartner) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      await deliveryPartner.updateLocation(req.body.coordinates);

      res.json({
        success: true,
        data: deliveryPartner,
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

// @route   DELETE /api/delivery-partners/:id
// @desc    Delete delivery partner
// @access  Private (Admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(req.params.id);

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    await deliveryPartner.remove();

    res.json({
      success: true,
      message: "Delivery partner deleted successfully",
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
