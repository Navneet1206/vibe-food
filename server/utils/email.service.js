const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const templates = {
  verificationEmail: (token) => ({
    subject: "Verify Your Email Address",
    html: `
      <h1>Welcome to GatiyanFood!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${process.env.CLIENT_URL}/verify-email?token=${token}">
        Verify Email
      </a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  }),
  passwordReset: (token) => ({
    subject: "Reset Your Password",
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${process.env.CLIENT_URL}/reset-password?token=${token}">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  }),
  orderConfirmation: (order) => ({
    subject: "Order Confirmation",
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order! Here are your order details:</p>
      <p>Order ID: ${order._id}</p>
      <p>Total Amount: $${order.finalAmount}</p>
      <p>Estimated Delivery Time: ${order.estimatedDeliveryTime}</p>
      <p>You can track your order at: ${process.env.CLIENT_URL}/orders/${order._id}</p>
    `,
  }),
  orderStatusUpdate: (order) => ({
    subject: "Order Status Update",
    html: `
      <h1>Order Status Update</h1>
      <p>Your order #${order._id} status has been updated to: ${order.status}</p>
      <p>You can track your order at: ${process.env.CLIENT_URL}/orders/${order._id}</p>
    `,
  }),
  vendorApproval: () => ({
    subject: "Vendor Account Approved",
    html: `
      <h1>Account Approved</h1>
      <p>Congratulations! Your vendor account has been approved.</p>
      <p>You can now log in and start managing your menu and orders.</p>
      <p>Login at: ${process.env.CLIENT_URL}/vendor/login</p>
    `,
  }),
  deliveryPartnerApproval: () => ({
    subject: "Delivery Partner Account Approved",
    html: `
      <h1>Account Approved</h1>
      <p>Congratulations! Your delivery partner account has been approved.</p>
      <p>You can now log in and start accepting delivery requests.</p>
      <p>Login at: ${process.env.CLIENT_URL}/delivery/login</p>
    `,
  }),
};

// Send email function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = {
  sendEmail,
  templates,
};
