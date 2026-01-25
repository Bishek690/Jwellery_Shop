import { Router } from 'express';
import { 
  createReview, 
  getApprovedReviews, 
  getAllReviews, 
  updateReviewStatus, 
  deleteReview 
} from '../controller/reviewController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/approved', getApprovedReviews);

// Customer routes (authenticated)
router.post('/', authenticate, createReview);

// Admin routes
router.get('/admin/all', authenticate, authorize(['admin']), getAllReviews);
router.patch('/admin/:id/status', authenticate, authorize(['admin']), updateReviewStatus);
router.delete('/admin/:id', authenticate, authorize(['admin']), deleteReview);

export default router;
