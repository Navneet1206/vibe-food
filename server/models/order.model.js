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

// Helper methods
orderSchema.methods.updateStatus = async function (newStatus, updatedBy) {
  if (!this.isValidStatusTransition(newStatus)) {
    throw new Error("Invalid status transition");
  }
  this.status = newStatus;
  if (newStatus === "delivered") {
    this.actualDeliveryTime = new Date();
  }
  await this.save();
};

orderSchema.methods.isValidStatusTransition = function (newStatus) {
  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready_for_pickup", "cancelled"],
    ready_for_pickup: ["assigned_to_delivery", "cancelled"],
    assigned_to_delivery: ["picked_up", "cancelled"],
    picked_up: ["on_the_way", "cancelled"],
    on_the_way: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  return validTransitions[this.status].includes(newStatus);
};

orderSchema.methods.cancelOrder = async function (reason, requestedBy) {
  if (this.status === "delivered" || this.status === "cancelled") {
    throw new Error("Cannot cancel order in current status");
  }
  this.status = "cancelled";
  this.cancellationReason = reason;
  this.cancellationRequestedBy = requestedBy;
  await this.save();
};

orderSchema.methods.addReview = async function (rating, review) {
  if (this.status !== "delivered") {
    throw new Error("Can only review delivered orders");
  }
  this.rating = rating;
  this.review = review;
  await this.save();
};

orderSchema.methods.assignDeliveryPartner = async function (deliveryPartnerId) {
  if (this.status !== "ready_for_pickup") {
    throw new Error(
      "Can only assign delivery partner when order is ready for pickup"
    );
  }
  this.deliveryPartner = deliveryPartnerId;
  this.status = "assigned_to_delivery";
  await this.save();
};

orderSchema.methods.calculateDeliveryFee = function (distance) {
  // Base delivery fee
  let fee = 10;
  // Add distance-based fee (e.g., $1 per km)
  fee += distance;
  return fee;
};

orderSchema.methods.calculateTax = function () {
  // Assuming 10% tax rate
  return this.totalAmount * 0.1;
};

orderSchema.methods.calculateFinalAmount = function () {
  this.tax = this.calculateTax();
  this.finalAmount = this.totalAmount + this.deliveryFee + this.tax;
};

// Static methods
orderSchema.statics.getOrdersByStatus = function (status) {
  return this.find({ status }).populate("user vendor deliveryPartner");
};

orderSchema.statics.getOrdersByUser = function (userId) {
  return this.find({ user: userId }).populate("vendor deliveryPartner");
};

orderSchema.statics.getOrdersByVendor = function (vendorId) {
  return this.find({ vendor: vendorId }).populate("user deliveryPartner");
};

orderSchema.statics.getOrdersByDeliveryPartner = function (deliveryPartnerId) {
  return this.find({ deliveryPartner: deliveryPartnerId }).populate(
    "user vendor"
  );
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
