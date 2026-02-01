import { Router } from 'express';
import { getCustomerCount, getOrdersToday, getTotalRevenue, getDashboardStats } from '../controller/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Get all dashboard stats with comparisons (admin/staff/accountant)
router.get('/stats', authMiddleware(['admin', 'staff', 'accountant']), getDashboardStats);

// Get customer count (admin/staff/accountant)
router.get('/customer-count', authMiddleware(['admin', 'staff', 'accountant']), getCustomerCount);

// Get orders today (admin/staff/accountant)
router.get('/orders-today', authMiddleware(['admin', 'staff', 'accountant']), getOrdersToday);

// Get total revenue (admin/staff/accountant)
router.get('/revenue', authMiddleware(['admin', 'staff', 'accountant']), getTotalRevenue);

export default router;
