const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide item name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide item description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide item price"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Please provide item category"],
    enum: ["appetizers", "main-course", "desserts", "beverages", "other"],
  },
  image: String,
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number, // in minutes
    required: [true, "Please provide preparation time"],
  },
});

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide restaurant name"],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide restaurant description"],
    },
    cuisine: {
      type: String,
      required: [true, "Please provide cuisine type"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, "Please provide contact number"],
      },
      email: {
        type: String,
        required: [true, "Please provide email"],
      },
    },
    images: [String],
    logo: String,
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    menu: [menuItemSchema],
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "rejected"],
      default: "pending",
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
    minimumOrder: {
      type: Number,
      required: [true, "Please provide minimum order amount"],
      min: [0, "Minimum order cannot be negative"],
    },
    deliveryFee: {
      type: Number,
      required: [true, "Please provide delivery fee"],
      min: [0, "Delivery fee cannot be negative"],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    averagePreparationTime: {
      type: Number,
      default: 0,
    },
    documents: {
      businessLicense: String,
      taxId: String,
      healthCertificate: String,
    },
    commission: {
      type: Number,
      default: 10, // percentage
      min: [0, "Commission cannot be negative"],
      max: [100, "Commission cannot be more than 100"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for location-based queries
restaurantSchema.index({ location: "2dsphere" });

// Method to update restaurant rating
restaurantSchema.methods.updateRating = async function (newRating) {
  this.totalRatings += 1;
  this.rating =
    (this.rating * (this.totalRatings - 1) + newRating) / this.totalRatings;
  await this.save();
};

// Method to update restaurant status
restaurantSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  await this.save();
};

// Method to update restaurant revenue
restaurantSchema.methods.updateRevenue = async function (orderAmount) {
  this.totalOrders += 1;
  this.totalRevenue += orderAmount;
  await this.save();
};

module.exports = mongoose.model("Restaurant", restaurantSchema);
