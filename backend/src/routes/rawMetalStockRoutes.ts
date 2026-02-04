import { Router } from "express"
import { authenticate, authorize } from "../middleware/authMiddleware"
import {
  getRawMetalStocks,
  getRawMetalStock,
  createRawMetalStock,
  updateRawMetalStock,
  deleteRawMetalStock,
  adjustStockQuantity,
  getStockStatistics
} from "../controller/rawMetalStockController"

const router = Router()

// All routes require authentication and admin role
router.use(authenticate, authorize(['admin']))

// Get all raw metal stocks
router.get("/", getRawMetalStocks)

// Get statistics
router.get("/statistics", getStockStatistics)

// Get single raw metal stock
router.get("/:id", getRawMetalStock)

// Create new raw metal stock
router.post("/", createRawMetalStock)

// Update raw metal stock
router.patch("/:id", updateRawMetalStock)

// Adjust stock quantity
router.post("/:id/adjust", adjustStockQuantity)

// Delete raw metal stock
router.delete("/:id", deleteRawMetalStock)

export default router
