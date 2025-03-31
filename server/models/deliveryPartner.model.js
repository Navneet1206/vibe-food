const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const deliveryPartnerSchema = new mongoose.Schema(
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
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: {
      idProof: {
        type: String,
        default: "",
      },
      addressProof: {
        type: String,
        default: "",
      },
      vehicleRC: {
        type: String,
        default: "",
      },
      drivingLicense: {
        type: String,
        default: "",
      },
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
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
    cancelledDeliveries: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    todayEarnings: {
      type: Number,
      default: 0,
    },
    vehicleType: {
      type: String,
      enum: ["bicycle", "motorcycle", "car", "scooter"],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleColor: {
      type: String,
      trim: true,
    },
    preferredZones: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredWorkingHours: {
      start: {
        type: String,
        default: "09:00",
      },
      end: {
        type: String,
        default: "21:00",
      },
    },
    bankDetails: {
      accountNumber: {
        type: String,
        trim: true,
      },
      accountHolderName: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
deliveryPartnerSchema.index({ currentLocation: "2dsphere" });

// Hash password before saving
deliveryPartnerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Generate auth token
deliveryPartnerSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  this.tokens.push({ token });
  await this.save();
  return token;
};

// Generate email verification token
deliveryPartnerSchema.methods.generateEmailVerificationToken = function () {
  this.emailVerificationToken = jwt.sign(
    { id: this._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
};

// Generate password reset token
deliveryPartnerSchema.methods.generatePasswordResetToken = function () {
  this.resetPasswordToken = jwt.sign(
    { id: this._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
};

// Compare password
deliveryPartnerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Update location
deliveryPartnerSchema.methods.updateLocation = async function (coordinates) {
  this.currentLocation.coordinates = coordinates;
  await this.save();
};

// Update availability
deliveryPartnerSchema.methods.updateAvailability = async function (
  isAvailable
) {
  this.isAvailable = isAvailable;
  await this.save();
};

// Update online status
deliveryPartnerSchema.methods.updateOnlineStatus = async function (isOnline) {
  this.isOnline = isOnline;
  await this.save();
};

// Assign order
deliveryPartnerSchema.methods.assignOrder = async function (orderId) {
  this.currentOrder = orderId;
  await this.save();
};

// Complete order
deliveryPartnerSchema.methods.completeOrder = async function () {
  this.currentOrder = null;
  this.completedDeliveries += 1;
  this.totalDeliveries += 1;
  await this.save();
};

// Cancel order
deliveryPartnerSchema.methods.cancelOrder = async function () {
  this.currentOrder = null;
  this.cancelledDeliveries += 1;
  this.totalDeliveries += 1;
  await this.save();
};

// Update earnings
deliveryPartnerSchema.methods.updateEarnings = async function (amount) {
  this.totalEarnings += amount;
  this.todayEarnings += amount;
  await this.save();
};

// Add review
deliveryPartnerSchema.methods.addReview = async function (rating) {
  this.rating =
    (this.rating * this.totalReviews + rating) / (this.totalReviews + 1);
  this.totalReviews += 1;
  await this.save();
};

// Static method to find available delivery partners
deliveryPartnerSchema.statics.findAvailable = async function (
  coordinates,
  maxDistance = 5000
) {
  return this.find({
    isAvailable: true,
    isOnline: true,
    currentOrder: null,
    currentLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        $maxDistance: maxDistance,
      },
    },
  });
};

// Static method to get top performers
deliveryPartnerSchema.statics.getTopPerformers = async function (limit = 10) {
  return this.find({
    isApproved: true,
    totalDeliveries: { $gt: 0 },
  })
    .sort({
      rating: -1,
      completedDeliveries: -1,
    })
    .limit(limit);
};

const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);

module.exports = DeliveryPartner;
