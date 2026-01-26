import { Router } from 'express';
import { 
  getAnalyticsOverview,
  getSalesTrend,
  getCategoryDistribution,
  getTopProducts
} from '../controller/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Get analytics overview (admin/staff/accountant)
router.get('/overview', authMiddleware(['admin', 'staff', 'accountant']), getAnalyticsOverview);

// Get sales trend (admin/staff/accountant)
router.get('/sales-trend', authMiddleware(['admin', 'staff', 'accountant']), getSalesTrend);

// Get category distribution (admin/staff/accountant)
router.get('/category-distribution', authMiddleware(['admin', 'staff', 'accountant']), getCategoryDistribution);

// Get top products (admin/staff/accountant)
router.get('/top-products', authMiddleware(['admin', 'staff', 'accountant']), getTopProducts);

export default router;
