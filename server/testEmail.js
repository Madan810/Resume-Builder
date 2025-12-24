import dotenv from "dotenv";
dotenv.config();
import sendEmail from "./utils/sendEmail.js";

const test = async () => {
    try {
        console.log("Attempting to send test email...");
        console.log("SMTP Host:", process.env.SMTP_HOST);
        // Masking email for privacy in logs, but showing length to confirm it's loaded
        console.log("SMTP User Length:", process.env.SMTP_EMAIL ? process.env.SMTP_EMAIL.length : 0);

        await sendEmail({
            email: process.env.SMTP_EMAIL, // Send to self
            subject: "Test Email",
            message: "If you see this, email is working!",
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("FAILED to send email:");
        console.error(error);
    }
};

test();
