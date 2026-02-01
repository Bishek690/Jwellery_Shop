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

  const emailUser = process.env.EMAIL_USER;
  const emailFrom = process.env.EMAIL_FROM || 'Shree Hans RKS Jewellers';
  const from = `${emailFrom} <${emailUser}>`;

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

export const sendOrderConfirmationEmail = async (params: { 
  to: string; 
  name: string; 
  orderNumber: string; 
  totalAmount: number; 
  items: any[];
  shippingInfo: any;
}) => {
  const { to, name, orderNumber, totalAmount, items, shippingInfo } = params;
  const appUrl = process.env.FRONTEND_URL || `http://localhost:3000`;
  const subject = `Order Confirmation - ${orderNumber}`;

  const itemsList = items.map(item => 
    `- ${item.productName} (${item.metalType} ${item.purity}) x ${item.quantity} = Rs. ${item.totalPrice.toFixed(2)}`
  ).join('\n');

  const text = `Hello ${name},\n\nThank you for your order!\n\nOrder Details:\nOrder Number: ${orderNumber}\nTotal Amount: Rs. ${totalAmount.toFixed(2)}\n\nItems:\n${itemsList}\n\nShipping Address:\n${shippingInfo.fullName}\n${shippingInfo.address}, ${shippingInfo.city}\n${shippingInfo.state || ''} ${shippingInfo.zipCode || ''}\nPhone: ${shippingInfo.phone}\n\nYou can track your order at: ${appUrl}/account/orders\n\nThank you for shopping with us!\n\nBest regards,\n${process.env.EMAIL_FROM || "Jewelry Store"}`;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br>
        <span style="color: #666; font-size: 13px;">${item.metalType} ${item.purity} - ${item.weight}g</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.totalPrice.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
  <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #28a745 0%, #20863a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">✅ Order Confirmed! 💎</h1>
    </div>
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color:#333; margin-top: 0;">Hello ${name},</h2>
      <p style="font-size: 16px; line-height: 1.6;">Thank you for your order! We've received it and will process it shortly.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <p style="margin: 0; font-weight: 600; color: #333; margin-bottom: 10px;">📋 Order Details:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Order Number:</td>
            <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee; font-family: monospace;">${orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555;">Total Amount:</td>
            <td style="padding: 8px 12px; color: #333; font-weight: 600; font-size: 18px;">Rs. ${totalAmount.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">🛍️ Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-top: 0; margin-bottom: 10px;">📦 Shipping Address:</h3>
        <p style="margin: 0; color: #333; line-height: 1.6;">
          <strong>${shippingInfo.fullName}</strong><br>
          ${shippingInfo.address}<br>
          ${shippingInfo.city}${shippingInfo.state ? ', ' + shippingInfo.state : ''} ${shippingInfo.zipCode || ''}<br>
          Phone: ${shippingInfo.phone}
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/account/orders" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 2px 5px rgba(40, 167, 69, 0.3);">📦 Track Your Order</a>
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0; font-size: 16px;">📞 Need Help?</h3>
        <p style="color: #856404; margin: 0; font-size: 14px;">If you have any questions about your order, please don't hesitate to contact us.</p>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
        Contact us at <a href="mailto:${process.env.EMAIL_FROM || 'support@jewelry-store.com'}" style="color: #28a745;">${process.env.EMAIL_FROM || 'support@jewelry-store.com'}</a>
      </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM || "Jewelry Store"}. All rights reserved.</p>
    </div>
  </div>
  `;

  return sendEmail({ to, subject, text, html });
};

export const sendOrderStatusUpdateEmail = async (params: { 
  to: string; 
  name: string; 
  orderNumber: string; 
  status: string;
  notes?: string;
}) => {
  const { to, name, orderNumber, status, notes } = params;
  const appUrl = process.env.FRONTEND_URL || `http://localhost:3000`;
  const subject = `Order Update - ${orderNumber}`;

  const statusEmojis: { [key: string]: string } = {
    'pending': '⏳',
    'confirmed': '✅',
    'processing': '⚙️',
    'shipped': '🚚',
    'delivered': '📦',
    'cancelled': '❌',
  };

  const statusColors: { [key: string]: string } = {
    'pending': '#ffc107',
    'confirmed': '#28a745',
    'processing': '#17a2b8',
    'shipped': '#007bff',
    'delivered': '#28a745',
    'cancelled': '#dc3545',
  };

  const emoji = statusEmojis[status.toLowerCase()] || '📋';
  const color = statusColors[status.toLowerCase()] || '#667eea';

  const text = `Hello ${name},\n\nYour order ${orderNumber} has been updated!\n\nNew Status: ${status.toUpperCase()}\n${notes ? `\nNotes: ${notes}` : ''}\n\nYou can track your order at: ${appUrl}/account/orders\n\nThank you for shopping with us!\n\nBest regards,\n${process.env.EMAIL_FROM || "Jewelry Store"}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">${emoji} Order Status Updated</h1>
    </div>
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color:#333; margin-top: 0;">Hello ${name},</h2>
      <p style="font-size: 16px; line-height: 1.6;">Your order status has been updated!</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
        <p style="margin: 0; font-weight: 600; color: #333; margin-bottom: 10px;">📋 Order Details:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Order Number:</td>
            <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee; font-family: monospace;">${orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555;">Status:</td>
            <td style="padding: 8px 12px; color: ${color}; font-weight: 600; font-size: 18px;">${emoji} ${status.toUpperCase()}</td>
          </tr>
        </table>
      </div>

      ${notes ? `
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-top: 0; margin-bottom: 10px;">📝 Update Notes:</h3>
        <p style="margin: 0; color: #333;">${notes}</p>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/account/orders" style="background: ${color}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">📦 View Order Details</a>
      </div>

      <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #155724; margin-top: 0;">💡 What's Next?</h3>
        <p style="color: #155724; margin: 0;">You can track your order anytime by visiting your account page. We'll keep you updated with any changes!</p>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
        Questions? Contact us at <a href="mailto:${process.env.EMAIL_FROM || 'support@jewelry-store.com'}" style="color: ${color};">${process.env.EMAIL_FROM || 'support@jewelry-store.com'}</a>
      </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM || "Jewelry Store"}. All rights reserved.</p>
    </div>
  </div>
  `;

  return sendEmail({ to, subject, text, html });
};

export const sendPaymentConfirmationEmail = async (params: { 
  to: string; 
  name: string; 
  orderNumber: string; 
  totalAmount: number;
  paymentMethod: string;
}) => {
  const { to, name, orderNumber, totalAmount, paymentMethod } = params;
  const appUrl = process.env.FRONTEND_URL || `http://localhost:3000`;
  const subject = `Payment Confirmed - ${orderNumber}`;

  const text = `Hello ${name},\n\nYour payment has been confirmed!\n\nOrder Number: ${orderNumber}\nAmount Paid: Rs. ${totalAmount.toFixed(2)}\nPayment Method: ${paymentMethod}\n\nThank you for your payment. Your order is now being processed.\n\nYou can view your order at: ${appUrl}/account/orders\n\nThank you for shopping with us!\n\nBest regards,\n${process.env.EMAIL_FROM || "Jewelry Store"}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #28a745 0%, #20863a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">💳 Payment Confirmed! ✅</h1>
    </div>
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color:#333; margin-top: 0;">Hello ${name},</h2>
      <p style="font-size: 16px; line-height: 1.6;">Great news! We have received and confirmed your payment.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <p style="margin: 0; font-weight: 600; color: #333; margin-bottom: 10px;">💰 Payment Details:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Order Number:</td>
            <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee; font-family: monospace;">${orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Amount Paid:</td>
            <td style="padding: 8px 12px; color: #28a745; font-weight: 600; font-size: 18px; border-bottom: 1px solid #eee;">Rs. ${totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555;">Payment Method:</td>
            <td style="padding: 8px 12px; color: #333; text-transform: uppercase;">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</td>
          </tr>
        </table>
      </div>

      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
        <h3 style="color: #155724; margin: 10px 0; font-size: 20px;">Payment Successfully Confirmed</h3>
        <p style="color: #155724; margin: 10px 0;">Your order is now being processed and will be shipped soon!</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/account/orders" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 2px 5px rgba(40, 167, 69, 0.3);">📦 View Order Details</a>
      </div>

      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-top: 0;">🚚 What's Next?</h3>
        <ul style="color: #333; margin: 5px 0; line-height: 1.8;">
          <li>Your order will be carefully packaged</li>
          <li>We'll send you shipping updates via email</li>
          <li>You can track your order anytime from your account</li>
        </ul>
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0; font-size: 16px;">📧 Receipt</h3>
        <p style="color: #856404; margin: 0; font-size: 14px;">This email serves as your payment receipt. Please keep it for your records.</p>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
        Questions? Contact us at <a href="mailto:${process.env.EMAIL_FROM || 'support@jewelry-store.com'}" style="color: #28a745;">${process.env.EMAIL_FROM || 'support@jewelry-store.com'}</a>
      </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM || "Jewelry Store"}. All rights reserved.</p>
      <p style="margin: 5px 0 0 0;">Thank you for your trust in our jewelry collection! 💎</p>
    </div>
  </div>
  `;

  return sendEmail({ to, subject, text, html });
};
