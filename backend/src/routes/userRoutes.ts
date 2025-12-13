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
} from "../controller/userController";
import { authenticate } from "../middleware/authMiddleware";
import { validateCreateUser, validateUpdateUser } from "../validators/userValidator";

const router = Router();

// Authentication routes
router.post("/login", login);
router.post("/logout", logout);

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
