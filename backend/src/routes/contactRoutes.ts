import { Router } from "express"
import { 
  createContact, 
  getAllContacts, 
  updateContactStatus, 
  deleteContact 
} from "../controller/contactController"
import { authenticate } from "../middleware/authMiddleware"
import { authorize } from "../middleware/authMiddleware"

const router = Router()

// Public route - anyone can submit a contact form
router.post("/", createContact)

// Admin routes - require authentication and admin/staff role
router.get("/admin/all", authenticate, authorize(["admin", "staff"]), getAllContacts)
router.patch("/admin/:id/status", authenticate, authorize(["admin", "staff"]), updateContactStatus)
router.delete("/admin/:id", authenticate, authorize(["admin", "staff"]), deleteContact)

export default router
