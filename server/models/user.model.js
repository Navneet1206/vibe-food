const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
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
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  this.emailVerificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  this.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
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
