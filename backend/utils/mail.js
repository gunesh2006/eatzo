import { Resend } from "resend";
import dotenv from "dotenv";
import { genPdf } from "./genPdf.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (to, otp) => {
  await resend.emails.send({
    from: process.env.RESEND_EMAIL,
    to,
    subject: "Reset your Password",
    html: `<p>Your OTP for Password Reset is <b>${otp}</b>. It will expire in 5 minutes</p>`,
  });
};

export const sendDeliveryOtpMail = async (user, otp) => {
  await resend.emails.send({
    from: process.env.RESEND_EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `<p>Your OTP to receive your order is <b>${otp}</b>. It will expire in 5 minutes. Give this OTP to the delivery rider when they reach you.</p>`,
  });
};

export const sendInvoiceMail = async (user, orders) => {
  try {
    // Generate PDF buffer
    const pdfBuffer = await genPdf({ orders });

    await resend.emails.send({
      from: process.env.RESEND_EMAIL,
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
          type: "application/pdf",
          data: pdfBuffer.toString("base64"),
        },
      ],
    });

    console.log("Invoice email sent successfully");
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};
