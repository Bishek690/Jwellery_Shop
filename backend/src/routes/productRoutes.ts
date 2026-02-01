import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} from "../controller/productController";
import { authenticate } from "../middleware/authMiddleware";
import { uploadSingleImage, handleUploadError } from "../middleware/uploadMiddleware";

const router = Router();

// Protected routes (admin/staff only) - must come before /:id route
router.get("/admin/stats", authenticate, getProductStats);
router.post("/", authenticate, uploadSingleImage, handleUploadError, createProduct);
router.patch("/:id", authenticate, uploadSingleImage, handleUploadError, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

// Public routes (for customers)
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
