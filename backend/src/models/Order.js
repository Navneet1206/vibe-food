const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant.menu",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"],
  },
  price: {
    type: Number,
    required: true,
  },
  specialInstructions: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "picked-up",
        "delivering",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "wallet"],
      required: true,
    },
    paymentDetails: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    preparationTime: Number,
    deliveryTime: Number,
    cancellationReason: String,
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    review: String,
    notes: String,
    commission: {
      type: Number,
      default: 10, // percentage
    },
    deliveryPartnerEarnings: {
      type: Number,
      default: 0,
    },
    restaurantEarnings: {
      type: Number,
      default: 0,
    },
    platformEarnings: {
      type: Number,
      default: 0,
    },
    tracking: [
      {
        status: String,
        location: {
          type: {
            type: String,
            enum: ["Point"],
          },
          coordinates: [Number],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for location-based queries
orderSchema.index({ "deliveryAddress.coordinates": "2dsphere" });

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.orderNumber = `ORD${year}${month}${day}${random}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  if (newStatus === "delivered") {
    this.actualDeliveryTime = Date.now();
    this.deliveryTime = this.actualDeliveryTime - this.createdAt;
  }
  await this.save();
};

// Method to update tracking
orderSchema.methods.updateTracking = async function (status, coordinates) {
  this.tracking.push({
    status,
    location: {
      type: "Point",
      coordinates,
    },
  });
  await this.save();
};

// Method to calculate earnings
orderSchema.methods.calculateEarnings = async function () {
  this.deliveryPartnerEarnings = (this.deliveryFee * 80) / 100; // 80% of delivery fee
  this.restaurantEarnings =
    this.subtotal - (this.subtotal * this.commission) / 100;
  this.platformEarnings =
    this.total - this.deliveryPartnerEarnings - this.restaurantEarnings;
  await this.save();
};

module.exports = mongoose.model("Order", orderSchema);
