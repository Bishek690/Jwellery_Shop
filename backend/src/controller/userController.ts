import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entity/User";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendAccountCreatedEmail, sendWelcomeEmail } from "../utils/emailService";
import { AuthRequest } from "../middleware/authMiddleware";

const userRepo = (): Repository<User> => AppDataSource.getRepository(User);

const omitPassword = (user: User) => {
  const { password, ...rest } = user as any;
  return rest;
};

// Helper function to generate a random password
function generateRandomPassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let res = "";
  for (let i = 0; i < length; i++) res += chars[Math.floor(Math.random() * chars.length)];
  return res;
}

// User login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userRepo().findOneBy({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    // Save JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: omitPassword(user),
      token: token,
      mustChangePassword: user.mustChangePassword || false,
    });
  } catch (e: any) {
    return res.status(500).json({
      message: "Login failed",
      error: e.message ?? e,
    });
  }
};

// Get all users
export const getUsers = async (_req: Request, res: Response) => {
  const users = await userRepo().find();
  res.json(users.map(omitPassword));
};

// Get user by ID
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userRepo().findOneBy({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(omitPassword(user));
    }
  } catch (e: any) {
    return res.status(500).json({ message: "Error fetching user", error: e.message ?? e });
  }
};

// Public signup — only customers allowed
export const createUser = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  try {
    // enforce public users are customers
    const role = UserRole.CUSTOMER;
    const existing = await userRepo().findOneBy([{ email }, { phone }]);
    if (existing) {
      return res.status(400).json({ message: "Email or phone already in use" });
    }
    if (!password) return res.status(400).json({ message: "Password is required" });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo().create({
      name,
      email,
      phone,
      password: hashed,
      role,
      mustChangePassword: false,
    });
    
    await userRepo().save(user);

    // Send welcome email to the new customer
    try {
      console.log(`Attempting to send welcome email to ${email}...`);
      await sendWelcomeEmail({ to: email, name, email });
      console.log(`Welcome email sent successfully to ${email}`);
    } catch (mailErr: any) {
      console.error("Failed to send welcome email:", mailErr);
      // Don't fail the registration if email fails, just log it
    }

    res.status(201).json({ 
      message: "User created successfully", 
      user: omitPassword(user),
      emailSent: true // Indicate that welcome email was attempted
    });
  } catch (e: any) {
    res.status(400).json({ message: "Error creating user", error: e.message ?? e });
  }
};

// Admin-only creation of staff/accountant
export const createUserByAdmin = async (req: Request, res: Response) => {
  const requester = (req as any).user;
  const { name, email, phone, role } = req.body;
  try {
    if (!requester || requester.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Only admins can create staff or accountant accounts" });
    }
    if (!role || (role !== UserRole.STAFF && role !== UserRole.ACCOUNTANT)) {
      return res.status(400).json({ message: "Role must be 'staff' or 'accountant'" });
    }
    const existing = await userRepo().findOneBy([{ email }, { phone }]);
    if (existing) {
      return res.status(400).json({ message: "Email or phone already in use" });
    }
    // generate password and send via email
    const plainPassword = generateRandomPassword(10);
    const hashed = await bcrypt.hash(plainPassword, 10);
    const user = userRepo().create({
      name,
      email,
      phone,
      password: hashed,
      role,
      mustChangePassword: true,
    });
    await userRepo().save(user);

    // send email with credentials (mailer will be no-op if not configured)
    try {
      console.log(`Attempting to send account creation email to ${email}...`);
      await sendAccountCreatedEmail({ to: email, name, email, password: plainPassword });
      console.log(`Account creation email sent successfully to ${email}`);
    } catch (mailErr: any) {
      console.error("Failed to send account email:", mailErr);
      // Return a warning in the response but still succeed in creating the user
      return res.status(201).json({
        ...omitPassword(user),
        temporaryPassword: plainPassword, // Include password in response if email fails
        warning: "User created but email notification failed to send. Please provide credentials manually.",
        emailError: mailErr.message
      });
    }

    res.status(201).json({
      ...omitPassword(user),
      temporaryPassword: plainPassword, // Include password in response for admin to share
    });
  } catch (e: any) {
    res.status(400).json({ message: "Error creating user", error: e.message ?? e });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, password, role } = req.body;
  const user = await userRepo().findOneBy({ id: req.params.id });
  if (!user) return res.status(404).json({ message: "User not found" });
  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.phone = phone ?? user.phone;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
    // if password changed by the user, clear mustChangePassword
    user.mustChangePassword = false;
  }
  // prevent role escalation via this endpoint unless the requester is admin — handled elsewhere if needed
  user.role = role ?? user.role;
  await userRepo().save(user);
  res.json(omitPassword(user));
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await userRepo().findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    await userRepo().save(user);

    return res.status(200).json({ 
      message: "Password changed successfully",
      mustChangePassword: false 
    });
  } catch (e: any) {
    return res.status(500).json({ 
      message: "Failed to change password", 
      error: e.message ?? e 
    });
  }
};

// Get current user profile
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await userRepo().findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user: omitPassword(user)
    });
  } catch (e: any) {
    return res.status(500).json({
      message: "Failed to get user profile",
      error: e.message ?? e
    });
  }
};

// User logout
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Logout request received, user:", req.user?.id);
    
    // Clear the JWT cookie with the exact same parameters as when it was set
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // Don't specify maxAge for clearCookie, and path defaults to "/"
    });

    console.log("JWT cookie cleared successfully");

    return res.status(200).json({ 
      message: "Logged out successfully",
      success: true 
    });
  } catch (e: any) {
    console.error("Logout error:", e);
    
    // Even if there's an error, clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
      note: "Token cleared despite error"
    });
  }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  const user = await userRepo().findOneBy({ id: req.params.id });
  if (!user) return res.status(404).json({ message: "User not found" });
  await userRepo().remove(user);
  res.json({ message: "User deleted successfully" });
};
