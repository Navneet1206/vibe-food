const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const DeliveryPartner = require("../models/DeliveryPartner");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

describe("Order Routes", () => {
  let customerToken;
  let restaurantToken;
  let partnerToken;
  let adminToken;
  let testRestaurant;
  let testPartner;
  let testOrder;

  const testCustomer = {
    name: "Test Customer",
    email: "customer@example.com",
    password: "password123",
    phone: "1234567890",
    role: "customer",
  };

  const testRestaurantUser = {
    name: "Restaurant Owner",
    email: "restaurant@example.com",
    password: "password123",
    phone: "1234567890",
    role: "restaurant",
  };

  const testPartnerUser = {
    name: "Delivery Partner",
    email: "partner@example.com",
    password: "password123",
    phone: "1234567890",
    role: "delivery_partner",
  };

  const testAdmin = {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    phone: "1234567890",
    role: "admin",
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

  const testPartnerData = {
    vehicleType: "bike",
    vehicleNumber: "MH-01-AB-1234",
    vehicleColor: "Black",
    vehicleModel: "Honda Activa",
    vehicleYear: "2020",
    currentLocation: {
      type: "Point",
      coordinates: [73.123456, 18.123456],
    },
    documents: {
      drivingLicense: {
        number: "DL-123456",
        expiryDate: "2025-12-31",
        image: "driving_license.jpg",
      },
      vehicleRegistration: {
        number: "VR-123456",
        expiryDate: "2025-12-31",
        image: "vehicle_registration.jpg",
      },
      insurance: {
        number: "INS-123456",
        expiryDate: "2025-12-31",
        image: "insurance.jpg",
      },
      backgroundCheck: {
        status: "verified",
        report: "background_check.pdf",
      },
    },
    workingHours: {
      monday: { start: "09:00", end: "21:00" },
      tuesday: { start: "09:00", end: "21:00" },
      wednesday: { start: "09:00", end: "21:00" },
      thursday: { start: "09:00", end: "21:00" },
      friday: { start: "09:00", end: "21:00" },
      saturday: { start: "10:00", end: "21:00" },
      sunday: { start: "10:00", end: "21:00" },
    },
    bankDetails: {
      accountNumber: "1234567890",
      accountName: "Test Partner",
      bankName: "Test Bank",
      ifscCode: "TEST0001",
    },
  };

  const testOrderData = {
    items: [
      {
        menuItem: "507f1f77bcf86cd799439011", // Will be replaced with actual menu item ID
        quantity: 2,
        price: 150,
        specialInstructions: "Extra spicy",
      },
    ],
    deliveryAddress: {
      street: "456 Delivery St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      instructions: "Ring doorbell 2B",
    },
    paymentMethod: "online",
  };

  beforeEach(async () => {
    // Create test users
    const customer = await User.create(testCustomer);
    const restaurantUser = await User.create(testRestaurantUser);
    const partnerUser = await User.create(testPartnerUser);
    const admin = await User.create(testAdmin);

    // Generate tokens
    customerToken = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    restaurantToken = jwt.sign(
      { id: restaurantUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    partnerToken = jwt.sign({ id: partnerUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Create test restaurant
    testRestaurant = await Restaurant.create({
      ...testRestaurantData,
      owner: restaurantUser._id,
    });

    // Create test delivery partner
    testPartner = await DeliveryPartner.create({
      ...testPartnerData,
      user: partnerUser._id,
    });

    // Create test order
    testOrder = await Order.create({
      ...testOrderData,
      customer: customer._id,
      restaurant: testRestaurant._id,
      deliveryPartner: testPartner._id,
      status: "pending",
      paymentStatus: "pending",
      subtotal: 300,
      deliveryFee: 20,
      tax: 30,
      total: 350,
    });
  });

  describe("POST /api/orders", () => {
    it("should create a new order", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          ...testOrderData,
          restaurant: testRestaurant._id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("orderNumber");
      expect(response.body).toHaveProperty("status", "pending");
      expect(response.body).toHaveProperty("paymentStatus", "pending");
    });

    it("should not create order without required fields", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should not create order below minimum amount", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          ...testOrderData,
          restaurant: testRestaurant._id,
          items: [
            {
              menuItem: "507f1f77bcf86cd799439011",
              quantity: 1,
              price: 50,
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Order amount below minimum"
      );
    });
  });

  describe("GET /api/orders", () => {
    it("should get customer's orders", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].customer).toBe(testOrder.customer.toString());
    });

    it("should get restaurant's orders", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${restaurantToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].restaurant).toBe(testOrder.restaurant.toString());
    });

    it("should get delivery partner's orders", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${partnerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].deliveryPartner).toBe(
        testOrder.deliveryPartner.toString()
      );
    });

    it("should filter orders by status", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .query({ status: "pending" });

      expect(response.status).toBe(200);
      expect(response.body.every((o) => o.status === "pending")).toBeTruthy();
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should get order by id", async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", testOrder._id.toString());
    });

    it("should return 404 for non-existent order", async () => {
      const response = await request(app)
        .get("/api/orders/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Order not found");
    });
  });

  describe("PUT /api/orders/:id/status", () => {
    it("should update order status", async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set("Authorization", `Bearer ${restaurantToken}`)
        .send({ status: "confirmed" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "confirmed");
    });

    it("should not allow invalid status transition", async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set("Authorization", `Bearer ${restaurantToken}`)
        .send({ status: "delivered" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should not allow unauthorized status update", async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ status: "confirmed" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });

  describe("PUT /api/orders/:id/tracking", () => {
    it("should update order tracking", async () => {
      const trackingData = {
        status: "picked_up",
        location: {
          type: "Point",
          coordinates: [73.987654, 18.987654],
        },
      };

      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/tracking`)
        .set("Authorization", `Bearer ${partnerToken}`)
        .send(trackingData);

      expect(response.status).toBe(200);
      expect(response.body.tracking).toContainEqual(trackingData);
    });

    it("should not allow non-delivery partner to update tracking", async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/tracking`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          status: "picked_up",
          location: {
            type: "Point",
            coordinates: [73.987654, 18.987654],
          },
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });

  describe("PUT /api/orders/:id/rating", () => {
    it("should rate an order", async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/rating`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          rating: 5,
          review: "Great service!",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("rating", 5);
      expect(response.body).toHaveProperty("review", "Great service!");
    });

    it("should not allow rating before delivery", async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/rating`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          rating: 5,
          review: "Great service!",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Order not delivered");
    });

    it("should not allow non-customer to rate order", async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/rating`)
        .set("Authorization", `Bearer ${restaurantToken}`)
        .send({
          rating: 5,
          review: "Great service!",
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });
});
