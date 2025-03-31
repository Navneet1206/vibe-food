const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
        specialInstructions: String,
      },
    ],
    totalAmount: {
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
    finalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "assigned_to_delivery",
        "picked_up",
        "on_the_way",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      required: true,
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: [Number],
      },
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    cancellationReason: String,
    cancellationRequestedBy: {
      type: String,
      enum: ["user", "vendor", "delivery_partner", "admin"],
    },
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    tracking: [
      {
        status: String,
        timestamp: Date,
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: [Number],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ deliveryPartner: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "deliveryAddress.coordinates": "2dsphere" });

// Method to update order status
orderSchema.methods.updateStatus = async function (newStatus, location = null) {
  this.status = newStatus;

  // Add tracking information
  this.tracking.push({
    status: newStatus,
    timestamp: new Date(),
    location: location || this.tracking[this.tracking.length - 1]?.location,
  });

  // Update delivery time if order is delivered
  if (newStatus === "delivered") {
    this.actualDeliveryTime = new Date();
  }

  await this.save();
};

// Method to calculate delivery time
orderSchema.methods.calculateDeliveryTime = function () {
  const now = new Date();
  // Add 30 minutes for preparation and 30 minutes for delivery
  this.estimatedDeliveryTime = new Date(now.getTime() + 60 * 60 * 1000);
};

// Method to cancel order
orderSchema.methods.cancelOrder = async function (reason, requestedBy) {
  this.status = "cancelled";
  this.cancellationReason = reason;
  this.cancellationRequestedBy = requestedBy;
  await this.save();
};

// Method to complete payment
orderSchema.methods.completePayment = async function () {
  this.paymentStatus = "completed";
  await this.save();
};

// Method to add review
orderSchema.methods.addReview = async function (rating, review) {
  this.rating = rating;
  this.review = review;
  await this.save();
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
