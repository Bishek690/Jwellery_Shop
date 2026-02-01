import { Router } from "express"
import { OrderController } from "../controller/orderController"
import { authenticate, authorize } from "../middleware/authMiddleware"

const router = Router()

// Customer routes
router.post("/", authenticate, authorize(["customer"]), OrderController.createOrder)
router.get("/my-orders", authenticate, authorize(["customer"]), OrderController.getMyOrders)
router.get("/my-orders/:id", authenticate, authorize(["customer"]), OrderController.getOrderById)
router.put("/my-orders/:id/cancel", authenticate, authorize(["customer"]), OrderController.cancelOrder)

// Admin/Staff routes
router.get("/admin/all", authenticate, authorize(["admin", "staff"]), OrderController.getAllOrders)
router.get("/admin/stats", authenticate, authorize(["admin", "staff"]), OrderController.getOrderStats)
router.get("/admin/:id", authenticate, authorize(["admin", "staff"]), OrderController.getOrderByIdAdmin)
router.put("/admin/:id/status", authenticate, authorize(["admin", "staff"]), OrderController.updateOrderStatus)
router.put("/admin/:id/payment", authenticate, authorize(["admin", "staff"]), OrderController.updatePaymentStatus)

export default router
