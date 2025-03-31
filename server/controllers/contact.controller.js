const { validationResult } = require("express-validator");
const { sendEmail } = require("../utils/email.service");

const contactController = {
    sendMessage: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, message } = req.body;

            // Send email to admin
            await sendEmail(
                process.env.ADMIN_EMAIL,
                "contactForm",
                { name, email, message }
            );

            res.status(200).json({
                success: true,
                message: "Message sent successfully",
            });
        } catch (error) {
            console.error("Contact form error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to send message",
            });
        }
    },
};

module.exports = contactController; 