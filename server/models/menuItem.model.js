const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "appetizers",
        "main_course",
        "desserts",
        "beverages",
        "soups",
        "salads",
        "sandwiches",
        "pizza",
        "pasta",
        "rice",
        "seafood",
        "vegetarian",
        "vegan",
        "gluten_free",
        "kids_menu",
      ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    calories: {
      type: Number,
      min: 0,
    },
    ingredients: [String],
    allergens: [String],
    spiceLevel: {
      type: String,
      enum: ["mild", "medium", "hot", "extra_hot"],
    },
    preparationTime: {
      type: Number, // in minutes
      min: 0,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search
menuItemSchema.index({ name: "text", description: "text" });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
