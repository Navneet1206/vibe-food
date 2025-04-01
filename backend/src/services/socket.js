const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user._id}`);

    // Join user-specific room
    socket.join(`user_${socket.user._id}`);

    // Join role-specific room
    if (socket.user.role === "restaurant") {
      socket.join(`restaurant_${socket.user._id}`);
    } else if (socket.user.role === "delivery_partner") {
      socket.join(`delivery_partner_${socket.user._id}`);
    }

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user._id}`);
    });
  });

  return io;
};

// Send notification to specific user
const sendToUser = (userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data);
};

// Send notification to all users with specific role
const sendToRole = (role, event, data) => {
  io.to(`role_${role}`).emit(event, data);
};

// Send notification to all connected clients
const sendToAll = (event, data) => {
  io.emit(event, data);
};

// Send notification to specific restaurant
const sendToRestaurant = (restaurantId, event, data) => {
  io.to(`restaurant_${restaurantId}`).emit(event, data);
};

// Send notification to specific delivery partner
const sendToDeliveryPartner = (deliveryPartnerId, event, data) => {
  io.to(`delivery_partner_${deliveryPartnerId}`).emit(event, data);
};

module.exports = {
  initializeSocket,
  sendToUser,
  sendToRole,
  sendToAll,
  sendToRestaurant,
  sendToDeliveryPartner,
};
