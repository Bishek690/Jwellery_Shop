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
  let token: string | undefined;

  // Priority 1: Check Bearer token in Authorization header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  // Priority 2: Check cookie if no Bearer token
  else {
    token = (req as any).cookies?.token;
  }

  if (!token) {
    return res.status(401).json({ 
      message: "Access denied. No token provided.",
      error: "Authentication required"
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const payload = jwt.verify(token, secret as jwt.Secret) as any;
    
    // Add user info to request
    req.user = { 
      id: payload.id, 
      role: payload.role 
    };
    
    next();
  } catch (e: any) {
    // Handle different JWT errors
    let errorMessage = "Invalid token";
    
    if (e.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (e.name === "JsonWebTokenError") {
      errorMessage = "Invalid token format";
    } else if (e.name === "NotBeforeError") {
      errorMessage = "Token not active yet";
    }
    
    return res.status(401).json({ 
      message: errorMessage,
      error: e.message ?? e
    });
  }
};
