const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const DeliveryPartner = require("../models/DeliveryPartner");
const jwt = require("jsonwebtoken");

describe("Delivery Partner Routes", () => {
  let partnerToken;
  let adminToken;
  let customerToken;
  let testPartner;

  const testPartnerUser = {
    name: "Test Partner",
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

  const testCustomer = {
    name: "Test Customer",
    email: "customer@example.com",
    password: "password123",
    phone: "1234567890",
    role: "customer",
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

  beforeEach(async () => {
    // Create test users
    const partner = await User.create(testPartnerUser);
    const admin = await User.create(testAdmin);
    const customer = await User.create(testCustomer);

    // Generate tokens
    partnerToken = jwt.sign({ id: partner._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    customerToken = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Create test delivery partner
    testPartner = await DeliveryPartner.create({
      ...testPartnerData,
      user: partner._id,
    });
  });

  describe("POST /api/delivery-partners", () => {
    it("should create a new delivery partner", async () => {
      const response = await request(app)
        .post("/api/delivery-partners")
        .set("Authorization", `Bearer ${partnerToken}`)
        .send(testPartnerData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "vehicleNumber",
        testPartnerData.vehicleNumber
      );
      expect(response.body).toHaveProperty("user");
    });

    it("should not create delivery partner without required fields", async () => {
      const response = await request(app)
        .post("/api/delivery-partners")
        .set("Authorization", `Bearer ${partnerToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should not allow customer to create delivery partner", async () => {
      const response = await request(app)
        .post("/api/delivery-partners")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(testPartnerData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });

  describe("GET /api/delivery-partners", () => {
    it("should get all delivery partners", async () => {
      const response = await request(app)
        .get("/api/delivery-partners")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should filter delivery partners by status", async () => {
      const response = await request(app)
        .get("/api/delivery-partners")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ status: "active" });

      expect(response.status).toBe(200);
      expect(response.body.every((p) => p.status === "active")).toBeTruthy();
    });

    it("should not allow non-admin to get all delivery partners", async () => {
      const response = await request(app)
        .get("/api/delivery-partners")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });

  describe("GET /api/delivery-partners/:id", () => {
    it("should get delivery partner by id", async () => {
      const response = await request(app)
        .get(`/api/delivery-partners/${testPartner._id}`)
        .set("Authorization", `Bearer ${partnerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", testPartner._id.toString());
    });

    it("should return 404 for non-existent delivery partner", async () => {
      const response = await request(app)
        .get("/api/delivery-partners/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${partnerToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "Delivery partner not found"
      );
    });
  });

  describe("PUT /api/delivery-partners/:id", () => {
    it("should update delivery partner details", async () => {
      const updateData = {
        vehicleColor: "Red",
        workingHours: {
          monday: { start: "10:00", end: "22:00" },
        },
      };

      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}`)
        .set("Authorization", `Bearer ${partnerToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "vehicleColor",
        updateData.vehicleColor
      );
      expect(response.body.workingHours.monday).toEqual(
        updateData.workingHours.monday
      );
    });

    it("should not allow non-partner to update details", async () => {
      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ vehicleColor: "Red" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });

    it("should allow admin to update delivery partner", async () => {
      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ vehicleColor: "Red" });

      expect(response.status).toBe(200);
    });
  });

  describe("PUT /api/delivery-partners/:id/status", () => {
    it("should update delivery partner status", async () => {
      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "suspended" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "suspended");
    });

    it("should not allow non-admin to update status", async () => {
      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}/status`)
        .set("Authorization", `Bearer ${partnerToken}`)
        .send({ status: "suspended" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });

    it("should validate status value", async () => {
      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "invalid_status" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/delivery-partners/:id/location", () => {
    it("should update delivery partner location", async () => {
      const newLocation = {
        type: "Point",
        coordinates: [73.987654, 18.987654],
      };

      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}/location`)
        .set("Authorization", `Bearer ${partnerToken}`)
        .send(newLocation);

      expect(response.status).toBe(200);
      expect(response.body.currentLocation).toEqual(newLocation);
    });

    it("should not allow non-partner to update location", async () => {
      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}/location`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          type: "Point",
          coordinates: [73.987654, 18.987654],
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });

    it("should validate location format", async () => {
      const response = await request(app)
        .put(`/api/delivery-partners/${testPartner._id}/location`)
        .set("Authorization", `Bearer ${partnerToken}`)
        .send({
          type: "Point",
          coordinates: [73.987654], // Invalid coordinates
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /api/delivery-partners/:id", () => {
    it("should delete delivery partner", async () => {
      const response = await request(app)
        .delete(`/api/delivery-partners/${testPartner._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Delivery partner deleted successfully"
      );

      // Verify delivery partner is deleted
      const deletedPartner = await DeliveryPartner.findById(testPartner._id);
      expect(deletedPartner).toBeNull();
    });

    it("should not allow non-admin to delete delivery partner", async () => {
      const response = await request(app)
        .delete(`/api/delivery-partners/${testPartner._id}`)
        .set("Authorization", `Bearer ${partnerToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });
});
