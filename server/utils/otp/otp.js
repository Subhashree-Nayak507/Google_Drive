import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// console.log("EMAIL_USERNAME is set:", !!process.env.EMAIL_USERNAME);
// console.log("EMAIL_PASSWORD is set:", !!process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",// Specifies Gmail’s SMTP server as the email service provider.
  port: 587,//Port 587 is used for TLS (Transport Layer Security) with SMTP, allowing secure email transmission without full encryption from the start
  secure: false, // The connection is not encrypt from strt .after initial handshake it will beencryprted
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true  //Outputs detailed logs to the console about the SMTP connection
});

//Transporter Verification
transporter.verify(function(error, success) {
  if (error) {
    console.error("Transporter verification failed:", error.message);
  } else {
    console.log("SMTP server connection successful - ready to send emails");
  }
});

export function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const emailSchema = z.string().email({ message: "Invalid email address" });

export const sendOTPEmail = async (email, otp) => {
     emailSchema.parse(email); 
    console.log("Attempting to send email to:", email);
  try {
    const mailOptions = {
      from: `"StoreIt" <${process.env.EMAIL_USERNAME}>`, 
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
   // console.log("Email sent successfully! Message ID:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Stack trace:", error.stack);
    return { success: false, error: error.message };
  }
};

