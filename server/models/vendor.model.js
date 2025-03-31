const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number, // in minutes
    required: true,
    min: 0,
  },
  ingredients: [
    {
      type: String,
      trim: true,
    },
  ],
  allergens: [
    {
      type: String,
      trim: true,
    },
  ],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
});

const vendorSchema = new mongoose.Schema(
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
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    businessType: {
      type: String,
      required: true,
      enum: ["restaurant", "cafe", "fast-food", "other"],
    },
    cuisine: [
      {
        type: String,
        trim: true,
      },
    ],
    logo: {
      type: String,
      default: null,
    },
    coverImage: {
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
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
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
    menu: [menuItemSchema],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    analytics: {
      totalOrders: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      averageOrderValue: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
vendorSchema.pre("save", async function (next) {
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
vendorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
vendorSchema.methods.generateEmailVerificationToken = function () {
  this.emailVerificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
};

// Method to generate password reset token
vendorSchema.methods.generatePasswordResetToken = function () {
  this.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
};

// Method to update analytics
vendorSchema.methods.updateAnalytics = async function (orderAmount) {
  this.analytics.totalOrders += 1;
  this.analytics.totalRevenue += orderAmount;
  this.analytics.averageOrderValue =
    this.analytics.totalRevenue / this.analytics.totalOrders;
  await this.save();
};

// Menu methods
vendorSchema.methods.addMenuItem = function (menuItem) {
  this.menu.push(menuItem);
};

vendorSchema.methods.updateMenuItem = function (itemId, updates) {
  const item = this.menu.id(itemId);
  if (item) {
    Object.assign(item, updates);
  }
};

vendorSchema.methods.removeMenuItem = function (itemId) {
  this.menu = this.menu.filter(
    (item) => item._id.toString() !== itemId.toString()
  );
};

vendorSchema.methods.getMenuByCategory = function (category) {
  return this.menu.filter((item) => item.category === category);
};

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
