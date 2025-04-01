const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

describe("Authentication Routes", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    phone: "1234567890",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("name", testUser.name);
      expect(response.body.user).toHaveProperty("email", testUser.email);
      expect(response.body.user).toHaveProperty("phone", testUser.phone);
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should not register user with existing email", async () => {
      await User.create(testUser);
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Email already registered");
    });

    it("should validate required fields", async () => {
      const response = await request(app).post("/api/auth/register").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it("should login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", testUser.email);
    });

    it("should not login with invalid password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      const user = await User.create(testUser);
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    });

    it("should get current user profile", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("email", testUser.email);
    });

    it("should not get profile without token", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });

    it("should not get profile with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Not authorized");
    });
  });

  describe("PUT /api/auth/update-password", () => {
    let token;

    beforeEach(async () => {
      const user = await User.create(testUser);
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    });

    it("should update password with valid current password", async () => {
      const response = await request(app)
        .put("/api/auth/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          newPassword: "newpassword123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Password updated successfully"
      );

      // Verify new password works
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "newpassword123",
      });

      expect(loginResponse.status).toBe(200);
    });

    it("should not update password with invalid current password", async () => {
      const response = await request(app)
        .put("/api/auth/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "wrongpassword",
          newPassword: "newpassword123",
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "error",
        "Current password is incorrect"
      );
    });

    it("should validate new password", async () => {
      const response = await request(app)
        .put("/api/auth/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          newPassword: "123", // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });
});
