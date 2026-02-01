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
  const appUrl = process.env.FRONTEND_URL || `http://${process.env.FRONTEND_URL || "localhost"}:3000`; // Frontend URL
  const subject = "Your Account Has Been Created - Jewelry Store";

  const text = `Hello ${name},\n\nYour account has been created for our Jewelry Store!\n\nAccount Details:\nEmail: ${email}\nTemporary Password: ${password}\n\nFor security reasons, please login at ${appUrl} and change your password immediately.\n\nThank you for joining us!\n\nBest regards,\n${process.env.EMAIL_FROM || "Jewelry Store Admin"}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Account Created Successfully! 💎</h1>
    </div>
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color:#333; margin-top: 0;">Hello ${name},</h2>
      <p style="font-size: 16px; line-height: 1.6;">Your account has been successfully created for our exclusive jewelry store by an administrator.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
        <p style="margin: 0; font-weight: 600; color: #333; margin-bottom: 10px;">🔑 Your Login Credentials:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Email:</td>
            <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee; font-family: monospace;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555;">Temporary Password:</td>
            <td style="padding: 8px 12px; color: #333; font-family: monospace; background: #fff3cd; border-radius: 4px;">${password}</td>
          </tr>
        </table>
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0; font-size: 16px;">⚠️ Important Security Notice</h3>
        <p style="color: #856404; margin: 0; font-size: 14px;">For your security, please change your password immediately after your first login.</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}" style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 2px 5px rgba(231, 76, 60, 0.3);">🔐 Login Now & Change Password</a>
      </div>

      <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #155724; margin-top: 0;">✨ What you can do after login:</h3>
        <ul style="color: #155724; margin: 0;">
          <li>Change your password to something secure</li>
          <li>Browse our exclusive jewelry collections</li>
          <li>Manage your profile and preferences</li>
          <li>Access special features based on your role</li>
        </ul>
      </div>

      <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
        <p style="color: #721c24; margin: 0; font-size: 14px;">
          <strong>🛡️ Security Tip:</strong> If you did not expect this account creation, please contact your administrator immediately or reply to this email.
        </p>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
        Need help? Contact us at <a href="mailto:${process.env.EMAIL_FROM || 'admin@jewelry-store.com'}" style="color: #e74c3c;">${process.env.EMAIL_FROM || 'admin@jewelry-store.com'}</a>
      </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM || "Jewelry Store"}. All rights reserved.</p>
      <p style="margin: 5px 0 0 0;">This email contains sensitive information. Please keep it secure.</p>
    </div>
  </div>
  `;

  return sendEmail({ to, subject, text, html });
};

export const sendWelcomeEmail = async (params: { to: string; name: string; email: string }) => {
  const { to, name, email } = params;
  const appUrl = process.env.FRONTEND_URL || `http://${process.env.FRONTEND_URL || "localhost"}:3000`; // Frontend URL
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
