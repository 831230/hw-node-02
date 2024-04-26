import dotenv from "dotenv";
import nodemailer from "nodemailer";
import process from "node:process";

dotenv.config();

const SECRET_EMAIL = process.env.SECRET_EMAIL;

const transporter = nodemailer.createTransport({
  port: 587,
  host: "mail.dp50.pl",
  auth: {
    user: "biuro@dp50.pl",
    pass: SECRET_EMAIL,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (verifyToken, email) => {
  console.log({ SECRET_EMAIL });
  const verifyLink = `http://localhost:3000/api/users/auth/verify/${verifyToken}`;
  const mailData = {
    from: "biuro@dp50.pl",
    to: "tomasz.bielecki@ledview.pl",
    subject: "Verification email",
    text: verifyLink,
  };

  const sendingInfo = await transporter.sendMail(mailData)

  return sendingInfo
};
