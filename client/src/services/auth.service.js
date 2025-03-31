import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User authentication
const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await api.post(`/auth/verify-email/${token}`);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
};

// Vendor authentication
const vendorLogin = async (credentials) => {
  const response = await api.post("/auth/vendor/login", credentials);
  return response.data;
};

const vendorRegister = async (vendorData) => {
  const formData = new FormData();
  Object.keys(vendorData).forEach((key) => {
    if (key === "logo") {
      formData.append("logo", vendorData[key]);
    } else {
      formData.append(key, vendorData[key]);
    }
  });

  const response = await api.post("/auth/vendor/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const verifyVendorEmail = async (token) => {
  const response = await api.post(`/auth/vendor/verify-email/${token}`);
  return response.data;
};

const vendorForgotPassword = async (email) => {
  const response = await api.post("/auth/vendor/forgot-password", { email });
  return response.data;
};

const vendorResetPassword = async (token, password) => {
  const response = await api.post("/auth/vendor/reset-password", {
    token,
    password,
  });
  return response.data;
};

// Delivery partner authentication
const deliveryLogin = async (credentials) => {
  const response = await api.post("/auth/delivery/login", credentials);
  return response.data;
};

const deliveryRegister = async (deliveryData) => {
  const formData = new FormData();
  Object.keys(deliveryData).forEach((key) => {
    if (key === "profilePicture") {
      formData.append("profilePicture", deliveryData[key]);
    } else {
      formData.append(key, deliveryData[key]);
    }
  });

  const response = await api.post("/auth/delivery/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const verifyDeliveryEmail = async (token) => {
  const response = await api.post(`/auth/delivery/verify-email/${token}`);
  return response.data;
};

const deliveryForgotPassword = async (email) => {
  const response = await api.post("/auth/delivery/forgot-password", { email });
  return response.data;
};

const deliveryResetPassword = async (token, password) => {
  const response = await api.post("/auth/delivery/reset-password", {
    token,
    password,
  });
  return response.data;
};

const authService = {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  vendorLogin,
  vendorRegister,
  verifyVendorEmail,
  vendorForgotPassword,
  vendorResetPassword,
  deliveryLogin,
  deliveryRegister,
  verifyDeliveryEmail,
  deliveryForgotPassword,
  deliveryResetPassword,
};

export default authService;
