const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Send OTP email
const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Email Verification OTP",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Welcome to GatiyanFood!",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to GatiyanFood!</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for joining GatiyanFood. We're excited to have you on board!</p>
                    <p>With GatiyanFood, you can:</p>
                    <ul>
                        <li>Order delicious food from your favorite restaurants</li>
                        <li>Track your orders in real-time</li>
                        <li>Rate and review your orders</li>
                        <li>Save your favorite restaurants and dishes</li>
                    </ul>
                    <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                    <p>Happy ordering!</p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Welcome email sending error:", error);
    return false;
  }
};

// Send order confirmation email
const sendOrderConfirmation = async (email, order) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Order Confirmation</h2>
                    <p>Dear Customer,</p>
                    <p>Thank you for your order! Here are your order details:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        <p><strong>Order Number:</strong> ${
                          order.orderNumber
                        }</p>
                        <p><strong>Restaurant:</strong> ${
                          order.restaurant.name
                        }</p>
                        <p><strong>Total Amount:</strong> ₹${order.total}</p>
                        <p><strong>Payment Method:</strong> ${
                          order.paymentMethod
                        }</p>
                    </div>
                    <h3 style="color: #333;">Order Items:</h3>
                    <ul>
                        ${order.items
                          .map(
                            (item) => `
                            <li>${item.menuItem.name} x ${item.quantity} - ₹${
                              item.price * item.quantity
                            }</li>
                        `
                          )
                          .join("")}
                    </ul>
                    <p>You can track your order status in real-time through our app.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Order confirmation email sending error:", error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTP,
  sendWelcomeEmail,
  sendOrderConfirmation,
};
