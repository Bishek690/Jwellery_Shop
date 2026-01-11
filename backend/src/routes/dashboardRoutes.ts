import { Router } from 'express';
import { getCustomerCount } from '../controller/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Get customer count (admin/staff only)
router.get('/customer-count', authMiddleware(['admin', 'staff', 'accountant']), getCustomerCount);

export default router;
