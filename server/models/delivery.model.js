const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const deliverySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isApproved: {
      type: Boolean,
      default: false,
    },
    documents: [
      {
        type: String, // URLs to uploaded documents
        required: true,
      },
    ],
    vehicleType: {
      type: String,
      required: true,
      enum: ["bicycle", "motorcycle", "car", "scooter"],
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isOnDuty: {
      type: Boolean,
      default: false,
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    completedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    earnings: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    statistics: {
      totalDeliveries: { type: Number, default: 0 },
      onTimeDeliveries: { type: Number, default: 0 },
      lateDeliveries: { type: Number, default: 0 },
      cancelledDeliveries: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
deliverySchema.index({ currentLocation: "2dsphere" });

// Hash password before saving
deliverySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
deliverySchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
deliverySchema.methods.generateEmailVerificationToken = function () {
  this.emailVerificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
};

// Method to generate password reset token
deliverySchema.methods.generatePasswordResetToken = function () {
  this.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
};

// Method to update location
deliverySchema.methods.updateLocation = async function (latitude, longitude) {
  this.currentLocation.coordinates = [longitude, latitude];
  await this.save();
};

// Method to update earnings
deliverySchema.methods.updateEarnings = async function (amount) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  this.earnings.daily += amount;
  this.earnings.weekly += amount;
  this.earnings.monthly += amount;
  this.earnings.total += amount;

  await this.save();
};

// Method to update statistics
deliverySchema.methods.updateStatistics = async function (type) {
  this.statistics.totalDeliveries += 1;

  switch (type) {
    case "onTime":
      this.statistics.onTimeDeliveries += 1;
      break;
    case "late":
      this.statistics.lateDeliveries += 1;
      break;
    case "cancelled":
      this.statistics.cancelledDeliveries += 1;
      break;
  }

  await this.save();
};

const DeliveryPartner = mongoose.model("DeliveryPartner", deliverySchema);

module.exports = DeliveryPartner;
