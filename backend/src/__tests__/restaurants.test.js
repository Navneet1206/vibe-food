const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const jwt = require("jsonwebtoken");

describe("Restaurant Routes", () => {
  let ownerToken;
  let adminToken;
  let customerToken;
  let testRestaurant;

  const testOwner = {
    name: "Restaurant Owner",
    email: "owner@example.com",
    password: "password123",
    phone: "1234567890",
    role: "restaurant",
  };

  const testAdmin = {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    phone: "1234567890",
    role: "admin",
  };

  const testCustomer = {
    name: "Test Customer",
    email: "customer@example.com",
    password: "password123",
    phone: "1234567890",
    role: "customer",
  };

  const testRestaurantData = {
    name: "Test Restaurant",
    description: "A test restaurant",
    cuisine: "Indian",
    address: {
      street: "123 Test St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
    },
    location: {
      type: "Point",
      coordinates: [73.123456, 18.123456],
    },
    contact: {
      phone: "1234567890",
      email: "restaurant@example.com",
    },
    openingHours: {
      monday: { open: "09:00", close: "22:00" },
      tuesday: { open: "09:00", close: "22:00" },
      wednesday: { open: "09:00", close: "22:00" },
      thursday: { open: "09:00", close: "22:00" },
      friday: { open: "09:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "22:00" },
    },
    minimumOrder: 100,
    deliveryFee: 20,
  };

  beforeEach(async () => {
    // Create test users
    const owner = await User.create(testOwner);
    const admin = await User.create(testAdmin);
    const customer = await User.create(testCustomer);

    // Generate tokens
    ownerToken = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    customerToken = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Create test restaurant
    testRestaurant = await Restaurant.create({
      ...testRestaurantData,
      owner: owner._id,
    });
  });

  describe("POST /api/restaurants", () => {
    it("should create a new restaurant", async () => {
      const response = await request(app)
        .post("/api/restaurants")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(testRestaurantData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", testRestaurantData.name);
      expect(response.body).toHaveProperty("owner");
    });

    it("should not create restaurant without required fields", async () => {
      const response = await request(app)
        .post("/api/restaurants")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should not allow customer to create restaurant", async () => {
      const response = await request(app)
        .post("/api/restaurants")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(testRestaurantData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });

  describe("GET /api/restaurants", () => {
    it("should get all restaurants", async () => {
      const response = await request(app).get("/api/restaurants");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should filter restaurants by status", async () => {
      const response = await request(app)
        .get("/api/restaurants")
        .query({ status: "active" });

      expect(response.status).toBe(200);
      expect(response.body.every((r) => r.status === "active")).toBeTruthy();
    });

    it("should filter restaurants by cuisine", async () => {
      const response = await request(app)
        .get("/api/restaurants")
        .query({ cuisine: "Indian" });

      expect(response.status).toBe(200);
      expect(response.body.every((r) => r.cuisine === "Indian")).toBeTruthy();
    });
  });

  describe("GET /api/restaurants/:id", () => {
    it("should get restaurant by id", async () => {
      const response = await request(app).get(
        `/api/restaurants/${testRestaurant._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "_id",
        testRestaurant._id.toString()
      );
    });

    it("should return 404 for non-existent restaurant", async () => {
      const response = await request(app).get(
        "/api/restaurants/507f1f77bcf86cd799439011"
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Restaurant not found");
    });
  });

  describe("PUT /api/restaurants/:id", () => {
    it("should update restaurant details", async () => {
      const updateData = {
        name: "Updated Restaurant Name",
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/api/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", updateData.name);
      expect(response.body).toHaveProperty(
        "description",
        updateData.description
      );
    });

    it("should not allow non-owner to update restaurant", async () => {
      const response = await request(app)
        .put(`/api/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ name: "Updated Name" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });

    it("should allow admin to update restaurant", async () => {
      const response = await request(app)
        .put(`/api/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Name" });

      expect(response.status).toBe(200);
    });
  });

  describe("PUT /api/restaurants/:id/status", () => {
    it("should update restaurant status", async () => {
      const response = await request(app)
        .put(`/api/restaurants/${testRestaurant._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "suspended" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "suspended");
    });

    it("should not allow non-admin to update status", async () => {
      const response = await request(app)
        .put(`/api/restaurants/${testRestaurant._id}/status`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ status: "suspended" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });

    it("should validate status value", async () => {
      const response = await request(app)
        .put(`/api/restaurants/${testRestaurant._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "invalid_status" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /api/restaurants/:id", () => {
    it("should delete restaurant", async () => {
      const response = await request(app)
        .delete(`/api/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Restaurant deleted successfully"
      );

      // Verify restaurant is deleted
      const deletedRestaurant = await Restaurant.findById(testRestaurant._id);
      expect(deletedRestaurant).toBeNull();
    });

    it("should not allow non-admin to delete restaurant", async () => {
      const response = await request(app)
        .delete(`/api/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });
});
