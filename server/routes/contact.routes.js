const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const contactController = require("../controllers/contact.controller");

// Validation middleware
const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

// Contact form route
router.post("/", contactValidation, contactController.sendMessage);

module.exports = router;
