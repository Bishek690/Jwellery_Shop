import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";

// Load env
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

console.log("=== Email Configuration Test ===");
console.log("ENV Path:", envPath);
console.log("\nEnvironment Variables:");
console.log("SMTP_HOST:", process.env.SMTP_HOST || "<NOT SET>");
console.log("SMTP_PORT:", process.env.SMTP_PORT || "<NOT SET>");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "<NOT SET>");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "***SET***" : "<NOT SET>");
console.log("EMAIL_FROM:", process.env.EMAIL_FROM || "<NOT SET>");

// Now try to send a test email
import { sendEmail } from "./src/utils/emailService";

async function testEmail() {
  try {
    console.log("\n=== Attempting to send test email ===");
    await sendEmail({
      to: process.env.EMAIL_USER || "test@example.com",
      subject: "Test Email from Jewelry Backend",
      text: "This is a test email to verify email configuration is working correctly.",
      html: "<h1>Test Email</h1><p>This is a test email to verify email configuration is working correctly.</p>"
    });
    console.log("\n✅ Test email sent successfully!");
  } catch (err) {
    console.error("\n❌ Test email failed:", err);
  }
}

testEmail();
