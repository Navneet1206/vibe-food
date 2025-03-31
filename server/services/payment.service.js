const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentService = {
  createOrder: async (amount, currency = 'INR') => {
    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `order_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new Error('Failed to create payment order');
    }
  },

  verifyPayment: (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    return expectedSign === razorpay_signature;
  },

  refundPayment: async (paymentId, amount) => {
    try {
      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount * 100, // Convert to paise
      });
      return refund;
    } catch (error) {
      throw new Error('Failed to process refund');
    }
  },
};

module.exports = paymentService; 