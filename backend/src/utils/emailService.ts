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
  const appUrl = process.env.WEBSITE_URL || `http://${process.env.HOST || "localhost"}:${process.env.PORT || 4000}`;
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
