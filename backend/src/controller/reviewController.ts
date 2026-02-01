import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Review } from '../entity/Review';
import { Repository } from 'typeorm';

const reviewRepo = (): Repository<Review> => AppDataSource.getRepository(Review);

// Create a new review (customer)
export const createReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const reviewRepository = reviewRepo();
    const { name, location, rating, comment } = req.body;
    const userId = (req as any).user?.id; // Changed from userId to id

    if (!name || !location || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = reviewRepository.create({
      userId,
      name,
      location,
      rating: parseInt(String(rating)),
      comment,
      status: 'pending'
    });

    await reviewRepository.save(review);

    res.status(201).json({
      message: 'Review submitted successfully! It will be visible after admin approval.',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// Get all approved reviews (public)
export const getApprovedReviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const reviewRepository = reviewRepo();
    const reviews = await reviewRepository.find({
      where: { status: 'approved' },
      order: { createdAt: 'DESC' },
      relations: ['user']
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Get all reviews (admin)
export const getAllReviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const reviewRepository = reviewRepo();
    const { status } = req.query;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const reviews = await reviewRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['user']
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Update review status (admin)
export const updateReviewStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const reviewRepository = reviewRepo();
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await reviewRepository.findOne({ where: { id: parseInt(id) } });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    await reviewRepository.save(review);

    res.json({
      message: `Review ${status} successfully`,
      review
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ message: 'Failed to update review status' });
  }
};

// Delete review (admin)
export const deleteReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const reviewRepository = reviewRepo();
    const { id } = req.params;

    const review = await reviewRepository.findOne({ where: { id: parseInt(id) } });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await reviewRepository.remove(review);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};
