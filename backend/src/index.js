const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/food-delivery",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  // Join room for order updates
  socket.on("joinOrder", (orderId) => {
    socket.join(`order:${orderId}`);
  });

  // Join room for delivery partner location updates
  socket.on("joinDelivery", (deliveryPartnerId) => {
    socket.join(`delivery:${deliveryPartnerId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Handle real-time order updates
  socket.on("orderUpdate", (data) => {
    io.emit("orderStatusChanged", data);
  });

  // Handle delivery partner location updates
  socket.on("locationUpdate", (data) => {
    io.emit("partnerLocationUpdated", data);
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/restaurants", require("./routes/restaurants"));
app.use("/api/delivery-partners", require("./routes/deliveryPartners"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));

// Payment routes
const paymentMiddleware = require("./middleware/payment");
app.post("/api/payment/create-order", paymentMiddleware.createOrder);
app.post("/api/payment/verify", paymentMiddleware.verifyPayment);
app.post("/api/payment/refund", paymentMiddleware.refundPayment);
app.post("/api/payment/transfer", paymentMiddleware.createTransfer);

// Payment webhook route (no body parser)
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  paymentMiddleware.handleWebhook
);

// Error handling middleware
const { errorHandler, notFound } = require("./middleware/error");
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
