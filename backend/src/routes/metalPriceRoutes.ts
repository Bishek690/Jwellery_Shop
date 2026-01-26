import { Router } from "express";
import { getCurrentPrices, updatePrices, getPriceHistory } from "../controller/metalPriceController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public route - anyone can view current prices
router.get("/current", getCurrentPrices);

// Protected routes - only admin and staff
router.post("/update", authMiddleware(["admin", "staff"]), updatePrices);
router.get("/history", authMiddleware(["admin", "staff"]), getPriceHistory);

export default router;
