const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menuItem.model");

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, "../.env") });

const sampleRestaurants = [
  {
    name: "Pizza Paradise",
    description: "Authentic Italian pizzas made with fresh ingredients",
    cuisine: "Italian",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      coordinates: {
        type: "Point",
        coordinates: [-74.006, 40.7128],
      },
    },
    phone: "+1-555-0123",
    email: "info@pizzaparadise.com",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    openingHours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "22:00" },
    },
    minimumOrder: 15,
    deliveryFee: 5,
  },
  {
    name: "Sushi Master",
    description: "Fresh and authentic Japanese cuisine",
    cuisine: "Japanese",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
      coordinates: {
        type: "Point",
        coordinates: [-118.2437, 34.0522],
      },
    },
    phone: "+1-555-0124",
    email: "info@sushimaster.com",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    openingHours: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "22:00" },
    },
    minimumOrder: 20,
    deliveryFee: 7,
  },
  {
    name: "Burger Bliss",
    description: "Gourmet burgers and hand-cut fries",
    cuisine: "American",
    address: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
      coordinates: {
        type: "Point",
        coordinates: [-87.6298, 41.8781],
      },
    },
    phone: "+1-555-0125",
    email: "info@burgerbliss.com",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    openingHours: {
      monday: { open: "10:00", close: "22:00" },
      tuesday: { open: "10:00", close: "22:00" },
      wednesday: { open: "10:00", close: "22:00" },
      thursday: { open: "10:00", close: "22:00" },
      friday: { open: "10:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "11:00", close: "22:00" },
    },
    minimumOrder: 10,
    deliveryFee: 4,
  },
];

const sampleMenuItems = [
  {
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, basil, and olive oil",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    category: "pizza",
    isVegetarian: true,
    calories: 800,
    ingredients: [
      "pizza dough",
      "tomato sauce",
      "mozzarella",
      "basil",
      "olive oil",
    ],
    preparationTime: 20,
  },
  {
    name: "California Roll",
    description: "Crab meat, avocado, cucumber, and tobiko",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    category: "main_course",
    isVegetarian: false,
    calories: 350,
    ingredients: ["sushi rice", "crab meat", "avocado", "cucumber", "tobiko"],
    preparationTime: 15,
  },
  {
    name: "Classic Cheeseburger",
    description:
      "Beef patty with cheddar cheese, lettuce, tomato, and special sauce",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "main_course",
    isVegetarian: false,
    calories: 650,
    ingredients: [
      "beef patty",
      "cheddar cheese",
      "lettuce",
      "tomato",
      "special sauce",
    ],
    preparationTime: 12,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log("Cleared existing data");

    // Insert restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log("Inserted restaurants");

    // Insert menu items and link them to restaurants
    for (let i = 0; i < sampleMenuItems.length; i++) {
      const menuItem = new MenuItem({
        ...sampleMenuItems[i],
        restaurant: restaurants[i % restaurants.length]._id,
      });
      await menuItem.save();
      restaurants[i % restaurants.length].menu.push(menuItem._id);
      await restaurants[i % restaurants.length].save();
    }
    console.log("Inserted menu items");

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
