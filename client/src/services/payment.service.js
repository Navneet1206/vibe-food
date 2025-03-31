import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const paymentService = {
  createOrder: async (orderId) => {
    try {
      const response = await axios.post(`${API_URL}/payments/create-order`, {
        orderId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create payment order"
      );
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const response = await axios.post(
        `${API_URL}/payments/verify`,
        paymentData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to verify payment"
      );
    }
  },

  refundPayment: async (orderId) => {
    try {
      const response = await axios.post(
        `${API_URL}/payments/refund/${orderId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to process refund"
      );
    }
  },

  initializeRazorpay: (orderData, onSuccess, onError) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "GatiyanFood",
      description: "Food Order Payment",
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData.orderId,
          });
          onSuccess(response);
        } catch (error) {
          onError(error);
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#4F46E5",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  },
};

export default paymentService;
