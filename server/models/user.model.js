const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
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
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    cart: {
      items: [
        {
          vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
          },
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Generate auth token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  this.tokens.push({ token });
  await this.save();
  return token;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
};

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Cart methods
userSchema.methods.addToCart = function (vendorId, itemId, quantity) {
  const cartItemIndex = this.cart.items.findIndex(
    (item) =>
      item.vendor.toString() === vendorId.toString() &&
      item.itemId.toString() === itemId.toString()
  );

  if (cartItemIndex > -1) {
    this.cart.items[cartItemIndex].quantity += quantity;
  } else {
    this.cart.items.push({
      vendor: vendorId,
      itemId,
      quantity,
    });
  }

  this.calculateCartTotal();
};

userSchema.methods.updateCartItem = function (itemId, quantity) {
  const cartItemIndex = this.cart.items.findIndex(
    (item) => item.itemId.toString() === itemId.toString()
  );

  if (cartItemIndex > -1) {
    this.cart.items[cartItemIndex].quantity = quantity;
    this.calculateCartTotal();
  }
};

userSchema.methods.removeFromCart = function (itemId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.itemId.toString() !== itemId.toString()
  );
  this.calculateCartTotal();
};

userSchema.methods.calculateCartTotal = async function () {
  let total = 0;
  for (const item of this.cart.items) {
    const vendor = await mongoose.model("Vendor").findById(item.vendor);
    const menuItem = vendor.menu.id(item.itemId);
    total += menuItem.price * item.quantity;
  }
  this.cart.totalAmount = total;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
