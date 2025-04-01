const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: {
        type: String,
        required: [true, "Please provide vehicle type"],
        enum: ["bicycle", "motorcycle", "car", "scooter", "bike"],
      },
      number: {
        type: String,
        required: [true, "Please provide vehicle number"],
      },
      color: String,
      model: String,
      year: Number,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "offline"],
      default: "pending",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    documents: {
      drivingLicense: String,
      vehicleRegistration: String,
      insurance: String,
      backgroundCheck: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be more than 5"],
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    averageDeliveryTime: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    preferredZones: [
      {
        type: String,
        trim: true,
      },
    ],
    workingHours: {
      start: String,
      end: String,
      days: [
        {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      ],
    },
    bankDetails: {
      accountNumber: String,
      accountHolderName: String,
      bankName: String,
      ifscCode: String,
    },
    commission: {
      type: Number,
      default: 80, // percentage of delivery fee
      min: [0, "Commission cannot be negative"],
      max: [100, "Commission cannot be more than 100"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for location-based queries
deliveryPartnerSchema.index({ currentLocation: "2dsphere" });

// Method to update delivery partner rating
deliveryPartnerSchema.methods.updateRating = async function (newRating) {
  this.totalRatings += 1;
  this.rating =
    (this.rating * (this.totalRatings - 1) + newRating) / this.totalRatings;
  await this.save();
};

// Method to update delivery partner status
deliveryPartnerSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  if (newStatus === "offline") {
    this.isOnline = false;
  }
  await this.save();
};

// Method to update delivery partner location
deliveryPartnerSchema.methods.updateLocation = async function (coordinates) {
  this.currentLocation = {
    type: "Point",
    coordinates,
  };
  this.lastActive = Date.now();
  await this.save();
};

// Method to update delivery partner earnings
deliveryPartnerSchema.methods.updateEarnings = async function (amount) {
  this.totalDeliveries += 1;
  this.totalEarnings += amount;
  await this.save();
};

// Method to update average delivery time
deliveryPartnerSchema.methods.updateDeliveryTime = async function (
  deliveryTime
) {
  this.averageDeliveryTime =
    (this.averageDeliveryTime * (this.totalDeliveries - 1) + deliveryTime) /
    this.totalDeliveries;
  await this.save();
};

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
