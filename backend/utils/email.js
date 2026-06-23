const nodemailer = require('nodemailer');

const getMailFrom = () => {
  return process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@veloura.com';
};

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Email service is not configured');
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user,
      pass,
    },
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: getMailFrom(),
    to,
    subject,
    text,
    html,
  });
};

const sendWelcomeEmail = async ({ to, firstName }) => {
  const name = firstName || 'there';

  return sendEmail({
    to,
    subject: 'Welcome to Veloura',
    text: `Hi ${name}, welcome to Veloura. Your account is ready and we are excited to have you with us.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1E1E1E; line-height: 1.6;">
        <h2 style="color: #0B1F3A;">Welcome to Veloura, ${name}</h2>
        <p>Your account is ready. Explore our latest ethnic wear collections and enjoy a premium shopping experience.</p>
        <p style="color: #0B1F3A; font-weight: 600;">Timeless Elegance, Modern Confidence.</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async ({ to, firstName, resetUrl }) => {
  const name = firstName || 'there';

  return sendEmail({
    to,
    subject: 'Reset your Veloura password',
    text: `Hi ${name}, reset your Veloura password using this link: ${resetUrl}. This link expires in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1E1E1E; line-height: 1.6;">
        <h2 style="color: #0B1F3A;">Reset your password</h2>
        <p>Hi ${name},</p>
        <p>Use the button below to reset your Veloura password. This link expires in 1 hour.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #0B1F3A; color: #ffffff; padding: 12px 18px; text-decoration: none; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
