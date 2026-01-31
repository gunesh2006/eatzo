import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { genPdf } from "./genPdf.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset your Password",
    html: `<p>Your OTP for Password Reset is <b>${otp}</b>. It will expire in 5 minutes</p>`,
  });
};

export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Delivery Otp",
    html: `<p>Your OTP to recieve your order is:  <b>${otp}</b>. It will expire in 5 minutes, give this otp to delivery rider when they reached to you.</p>`,
  });
};

export const sendInvoiceMail = async (user, orders) => {
  try {
    // Generate PDF as buffer
    const pdfBuffer = await genPdf({ orders });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Your Order Invoice",
      html: `
        <p>Hi <b>${user.fullName}</b>,</p>
        <p>Please find attached the invoice for your order.</p>
        <p>Thank you for shopping with us 🙌</p>
      `,
      attachments: [
        {
          filename: `invoice-${orders._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Invoice email sent successfully");
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};
