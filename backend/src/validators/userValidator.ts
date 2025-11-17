import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entity/User";

const isEmail = (email?: string) => typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPhone = (phone?: string) => typeof phone === "string" && /^\+?[0-9]{7,15}$/.test(phone);

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Name is required and must be at least 2 characters" });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }
  if (!isPhone(phone)) {
    return res.status(400).json({ message: "Valid phone number is required (7-15 digits)" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Password is required and must be at least 6 characters" });
  }
  // Prevent clients from setting privileged roles via public API
  if (role && role !== UserRole.CUSTOMER) {
    return res.status(403).json({ message: "Cannot assign role via public signup" });
  }
  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, password, role } = req.body;
  if (name && (typeof name !== "string" || name.trim().length < 2)) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  if (email && !isEmail(email)) {
    return res.status(400).json({ message: "Email is invalid" });
  }
  if (phone && !isPhone(phone)) {
    return res.status(400).json({ message: "Phone is invalid (7-15 digits)" });
  }
  if (password && (typeof password !== "string" || password.length < 6)) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  if (role && !Object.values(UserRole).includes(role)) {
    return res.status(400).json({ message: `Role must be one of: ${Object.values(UserRole).join(", ")}` });
  }
  next();
};
