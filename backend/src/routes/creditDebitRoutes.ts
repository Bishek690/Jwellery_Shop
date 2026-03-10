import { Router } from "express"
import { authenticate, authorize } from "../middleware/authMiddleware"
import {
  getAllRecords,
  getCustomerBalance,
  getAllCustomerBalances,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordById,
  getStatistics
} from "../controller/creditDebitController"

const router = Router()

// All routes require authentication and admin role
router.use(authenticate, authorize(["admin"]))

// Get all records with filters
router.get("/", getAllRecords)

// Get statistics
router.get("/statistics", getStatistics)

// Get all customer balances
router.get("/balances", getAllCustomerBalances)

// Get customer balance
router.get("/customer/:customer_id/balance", getCustomerBalance)

// Get record by ID
router.get("/:id", getRecordById)

// Create new record
router.post("/", createRecord)

// Update record
router.put("/:id", updateRecord)

// Delete record
router.delete("/:id", deleteRecord)

export default router
