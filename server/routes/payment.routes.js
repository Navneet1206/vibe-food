const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateUser } = require('../middleware/auth');

router.post('/create-order', authenticateUser, paymentController.createPaymentOrder);
router.post('/verify', authenticateUser, paymentController.verifyPayment);
router.post('/refund/:orderId', authenticateUser, paymentController.refundPayment);

module.exports = router; 