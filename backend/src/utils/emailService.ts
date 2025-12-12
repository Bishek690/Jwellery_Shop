import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("Email credentials not configured. EMAIL_USER or EMAIL_PASS missing.");
    return null;
  }

  console.log("Email config: Using Gmail with user:", user ? "***" : "missing");

  // Use Gmail's default SMTP settings
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { 
      user, 
      pass 
    },
  });
};

export const sendEmail = async (opts: MailOptions) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("Email service not configured. Skipping send.");
    console.log("Attempted to send:", { to: opts.to, subject: opts.subject });
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  try {
    console.log(`Attempting to send email to ${opts.to}...`);
    const info = await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    console.log(`Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
};

export const sendAccountCreatedEmail = async (params: { to: string; name: string; email: string; password: string }) => {
  const { to, name, email, password } = params;
  const appUrl = process.env.WEBSITE_URL || `http://${process.env.FRONTEND_URL || "localhost"}: || 3000}`;
  const subject = "Your account has been created";

  const text = `Hello ${name},\n\nAn account has been created for you.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login at ${appUrl} and change your password immediately.\n\nRegards,\n${process.env.EMAIL_FROM || "Admin"}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #222;">
    <h2 style="color:#333">Hello ${name},</h2>
    <p>An account has been created for you on <strong>${appUrl}</strong>.</p>
    <table style="border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding:6px 12px; font-weight:600;">Email:</td><td style="padding:6px 12px;">${email}</td></tr>
      <tr><td style="padding:6px 12px; font-weight:600;">Password:</td><td style="padding:6px 12px;">${password}</td></tr>
    </table>
    <p>Please <a href="${appUrl}" style="color:#1a73e8">login</a> and change your password immediately.</p>
    <p style="font-size:12px; color:#666;">If you did not expect this email, contact your administrator.</p>
    <hr />
    <p style="font-size:12px; color:#999;">&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM || "Your Company"}</p>
  </div>
  `;

  return sendEmail({ to, subject, text, html });
};

export const sendWelcomeEmail = async (params: { to: string; name: string; email: string }) => {
  const { to, name, email } = params;
  const appUrl = process.env.WEBSITE_URL || `http://${process.env.FRONTEND_URL || "localhost"}:3000`; // Frontend URL
  const subject = "Welcome to our Jewelry Store!";

  const text = `Hello ${name},\n\nWelcome to our Jewelry Store!\n\nYour account has been successfully created with the email: ${email}\n\nYou can now browse our exclusive collection of jewelry and make purchases.\n\nVisit our store: ${appUrl}\n\nThank you for joining us!\n\nBest regards,\n${process.env.EMAIL_FROM || "Jewelry Store Team"}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">💎 Welcome to Our Jewelry Store! 💎</h1>
    </div>
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color:#333; margin-top: 0;">Hello ${name},</h2>
      <p style="font-size: 16px; line-height: 1.6;">Thank you for joining our exclusive jewelry community! Your account has been successfully created.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
        <p style="margin: 0; font-weight: 600; color: #333;">Account Details:</p>
        <p style="margin: 5px 0; color: #666;">Email: <strong>${email}</strong></p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">🛍️ Start Shopping Now</a>
      </div>

      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1565c0; margin-top: 0;">What you can do now:</h3>
        <ul style="color: #333; margin: 0;">
          <li>Browse our exclusive jewelry collections</li>
          <li>Add items to your wishlist</li>
          <li>Enjoy secure checkout process</li>
          <li>Track your orders</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
        Need help? Contact us at <a href="mailto:${process.env.EMAIL_FROM || 'support@jewelry-store.com'}" style="color: #667eea;">${process.env.EMAIL_FROM || 'support@jewelry-store.com'}</a>
      </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM || "Jewelry Store"}. All rights reserved.</p>
    </div>
  </div>
  `;

  return sendEmail({ to, subject, text, html });
};
