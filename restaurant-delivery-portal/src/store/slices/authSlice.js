import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null, // 'restaurant' or 'delivery'
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  phoneNumber: null,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.phoneNumber = null;
      state.email = null;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setRole,
  setLoading,
  setError,
  setOtpSent,
  setOtpVerified,
  setPhoneNumber,
  setEmail,
  logout,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
