import { Router } from "express";
import {
  login,
  logout,
  getMe,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  createUserByAdmin,
  changePassword,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPasswordWithOTP,
} from "../controller/userController";
import { authenticate } from "../middleware/authMiddleware";
import { validateCreateUser, validateUpdateUser } from "../validators/userValidator";

const router = Router();

// Authentication routes
router.post("/login", login);
router.post("/logout", authenticate, logout);
// Fallback logout without authentication (in case token is invalid)
router.post("/logout-force", logout);

// Password reset routes (public)
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-otp", verifyPasswordResetOTP);
router.post("/reset-password", resetPasswordWithOTP);

// Get current user profile
router.get("/me", authenticate, getMe);

router.post("/change-password", authenticate, changePassword);

router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUser);
router.post("/", validateCreateUser, createUser);
// Admin creates staff or accountant
router.post("/create-by-admin", authenticate, createUserByAdmin);
router.patch("/:id", authenticate, validateUpdateUser, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;
