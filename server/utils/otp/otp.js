import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

console.log("Before transporter - EMAIL_USERNAME:", process.env.EMAIL_USERNAME);
console.log("Before transporter - EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate 4-digit OTP
 export function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

// Send OTP via email
 export const sendOTPEmail = async (email, otp) => {
  try {
    console.log("hit mail route")
    const mailOptions = {
      from: "StoreIt",
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
          <h1 style="background-color: #f2f2f2; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};