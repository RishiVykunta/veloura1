const nodemailer = require('nodemailer');

const getMailFrom = () => {
  return process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@veloura.com';
};

const getFrontendUrl = () => {
  return (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'https://veloura1-dh8p.vercel.app').replace(/\/$/, '');
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
  const homepageUrl = getFrontendUrl();

  return sendEmail({
    to,
    subject: '✨ Welcome to Veloura – Your Style Journey Begins',
    text: `Welcome to Veloura, ${name}. Your account is ready. Explore our curated ethnic fashion collection at ${homepageUrl}.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="dark only" />
          <meta name="supported-color-schemes" content="dark" />
          <title>Welcome to Veloura</title>
        </head>
        <body style="margin:0; padding:0; background-color:#0B0B0D; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family:Arial, Helvetica, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0B0B0D; margin:0; padding:0; width:100%;">
            <tr>
              <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; margin:0 auto;">
                  <tr>
                    <td style="padding:0 0 16px 0; text-align:center;">
                      <div style="display:inline-block; color:#D4AF37; font-size:12px; letter-spacing:3px; text-transform:uppercase; font-weight:700; padding:0 0 8px 0; border-bottom:1px solid rgba(212,175,55,0.35);">
                        Veloura
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#16161A; border:1px solid rgba(212,175,55,0.14); border-radius:24px; padding:40px 32px; box-shadow:0 18px 50px rgba(0,0,0,0.35);">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="padding:0 0 20px 0; text-align:center;">
                            <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:50%; background:rgba(212,175,55,0.12); color:#D4AF37; font-size:24px; font-weight:700; border:1px solid rgba(212,175,55,0.3);">
                              V
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:center; padding:0 0 14px 0;">
                            <div style="color:#FFFFFF; font-size:32px; line-height:1.15; font-weight:700; letter-spacing:-0.02em;">
                              Welcome to Veloura, ${name}! <span style="font-size:28px;">🌸</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:center; padding:0 0 24px 0;">
                            <div style="width:72px; height:2px; background:#D4AF37; margin:0 auto; border-radius:999px;"></div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 0 24px 0; text-align:center;">
                            <div style="color:#B8B8B8; font-size:16px; line-height:1.8;">
                              We're delighted to welcome you to the Veloura family.
                              <br /><br />
                              Your account has been successfully created, and you're now ready to explore our carefully curated collection of elegant ethnic wear designed for the modern woman.
                              <br /><br />
                              Whether you're searching for timeless classics or the latest arrivals, Veloura is here to make every occasion beautiful.
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 0 28px 0;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate; border-spacing:0;">
                              <tr>
                                <td style="background-color:#1A1A1F; border:1px solid rgba(212,175,55,0.12); border-radius:18px; padding:20px 18px;">
                                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                      <td style="padding:0 0 10px 0; color:#D4AF37; font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
                                        Explore Veloura
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color:#FFFFFF; font-size:15px; line-height:1.7; padding:0 0 12px 0;">
                                        ✨ Explore New Arrivals
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color:#FFFFFF; font-size:15px; line-height:1.7; padding:0 0 12px 0;">
                                        ❤️ Save Your Wishlist
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color:#FFFFFF; font-size:15px; line-height:1.7;">
                                        🚚 Fast & Secure Delivery
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:0 0 28px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td align="center" bgcolor="#D4AF37" style="border-radius:14px;">
                                  <a href="${homepageUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:16px 28px; color:#0B0B0D; text-decoration:none; font-size:16px; font-weight:700; border-radius:14px; background-color:#D4AF37; border:1px solid #D4AF37;">
                                    Explore Collection
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0; text-align:center;">
                            <div style="color:#B8B8B8; font-size:13px; line-height:1.8;">
                              Thank you for choosing Veloura.
                              <br />
                              <span style="color:#FFFFFF; font-weight:700;">Timeless Elegance. Modern Confidence.</span>
                              <br /><br />
                              With Love,
                              <br />
                              Team Veloura
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 8px 0 8px; text-align:center;">
                      <div style="color:#7C7C82; font-size:12px; line-height:1.6;">
                        You’re receiving this because you created a Veloura account.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
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
