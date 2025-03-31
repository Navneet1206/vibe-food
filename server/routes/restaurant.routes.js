const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const restaurantController = require("../controllers/restaurant.controller");

// Public routes
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.get("/:id/menu", restaurantController.getMenuItemsByRestaurant);
router.get("/menu", restaurantController.getAllMenuItems);

// Protected routes
router.use(verifyToken);

// Admin routes
router.post("/", restaurantController.createRestaurant);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
