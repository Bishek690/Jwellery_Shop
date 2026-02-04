import { Router } from "express"
import { authenticate, authorize } from "../middleware/authMiddleware"
import { uploadBillImage, handleUploadError } from "../middleware/uploadMiddleware"
import {
  getSalesRecords,
  getSalesRecord,
  createSalesRecord,
  updateSalesRecord,
  deleteSalesRecord,
  getSalesStatistics
} from "../controller/salesRecordController"

const router = Router()

// All routes require authentication and admin/staff role
router.use(authenticate, authorize(['admin', 'staff']))

// Get all sales records
router.get("/", getSalesRecords)

// Get statistics
router.get("/statistics", getSalesStatistics)

// Get single sales record
router.get("/:id", getSalesRecord)

// Create new sales record with bill image upload
router.post("/", uploadBillImage, handleUploadError, createSalesRecord)

// Update sales record with optional bill image upload
router.patch("/:id", uploadBillImage, handleUploadError, updateSalesRecord)

// Delete sales record
router.delete("/:id", deleteSalesRecord)

export default router
