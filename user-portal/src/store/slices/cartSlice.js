import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  total: 0,
  deliveryFee: 40,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      // If cart is empty or item is from same restaurant
      if (!state.restaurantId || state.restaurantId === newItem.restaurantId) {
        const existingItem = state.items.find((item) => item.id === newItem.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...newItem, quantity: 1 });
        }

        state.restaurantId = newItem.restaurantId;
        state.restaurantName = newItem.restaurantName;
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      } else {
        // If trying to add item from different restaurant
        alert(
          "Please clear your cart or complete your order before adding items from a different restaurant."
        );
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);

      if (item) {
        item.quantity = Math.max(1, quantity);
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
