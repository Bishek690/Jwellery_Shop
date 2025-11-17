import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import { AppDataSource } from "../src/config/data-source";
import bcrypt from "bcryptjs";
import { User, UserRole } from "../src/entity/User";

// Ensure we load the backend/.env reliably when running this seed script
const envPath = process.env.DOTENV_PATH || path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

// Diagnostic logs to help debug failures when running the seed script
console.log("[seed] env path:", envPath);
console.log("[seed] SEED_ADMIN_EMAIL:", process.env.SEED_ADMIN_EMAIL ? process.env.SEED_ADMIN_EMAIL : "<not set>");
console.log("[seed] SEED_ADMIN_NAME:", process.env.SEED_ADMIN_NAME ? process.env.SEED_ADMIN_NAME : "<not set>");
console.log("[seed] SEED_ADMIN_PASSWORD set:", !!process.env.SEED_ADMIN_PASSWORD);
console.log("[seed] SEED_SALT_ROUNDS:", process.env.SEED_SALT_ROUNDS || "<default 10>");
console.log("[seed] NODE_ENV:", process.env.NODE_ENV || "<not set>");

// Show minimal DB config presence (do not print credentials)
const dbInfo = {
  DATABASE_URL: !!process.env.DATABASE_URL,
  TYPEORM_HOST: !!process.env.TYPEORM_HOST,
  TYPEORM_PORT: !!process.env.TYPEORM_PORT,
  TYPEORM_USERNAME: !!process.env.TYPEORM_USERNAME,
  TYPEORM_DATABASE: !!process.env.TYPEORM_DATABASE,
};
console.log("[seed] DB config presence:", dbInfo);

async function run() {
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);

    const email = process.env.SEED_ADMIN_EMAIL?.trim();
    const phone = process.env.SEED_ADMIN_PHONE?.trim() || "";
    const name = process.env.SEED_ADMIN_NAME?.trim();
    const plain = process.env.SEED_ADMIN_PASSWORD;

    // Validate required env vars
    if (!email || !name || !plain) {
      console.error(
        "Missing required seed environment variables. Please set SEED_ADMIN_EMAIL, SEED_ADMIN_NAME and SEED_ADMIN_PASSWORD."
      );
      process.exit(1);
    }
    
    // Warn if phone is missing (but allow it)
    if (!phone) {
      console.warn("Warning: SEED_ADMIN_PHONE is not set. Using empty string for phone.");
    }

    // Prevent accidental creation when email is obviously invalid
    if (!email.includes("@")) {
      console.error("SEED_ADMIN_EMAIL does not look like a valid email:", email);
      process.exit(1);
    }

    const existing = await repo.findOne({ where: { email } });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      await AppDataSource.destroy();
      process.exit(0);
    }

    const saltRounds = parseInt(process.env.SEED_SALT_ROUNDS || "10", 10) || 10;
    const hashed = await bcrypt.hash(plain, saltRounds);

    const admin = repo.create({
      name,
      email,
      phone,
      password: hashed,
      role: UserRole.ADMIN,
      mustChangePassword: false,
    });

    await repo.save(admin);

    // For security, avoid printing the plaintext password in production logs.
    if (process.env.NODE_ENV === "production") {
      console.log(`Created admin: ${email}`);
    } else {
      console.log(`Created admin: ${email} / ${plain}`);
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (e) {
    console.error("Failed to create admin:", e);
    try {
      await AppDataSource.destroy();
    } catch (_) {
      // ignore
    }
    process.exit(1);
  }
}

run();
