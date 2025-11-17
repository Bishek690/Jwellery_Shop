import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // Support Bearer token in header or cookie named 'token'
  let token: string | undefined;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = (req as any).cookies?.token;
  }

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const secret = process.env.JWT_SECRET || "change_this_secret";
    const payload = jwt.verify(token, secret as jwt.Secret) as any;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (e: any) {
    return res.status(401).json({ message: "Invalid token", error: e.message ?? e });
  }
};
