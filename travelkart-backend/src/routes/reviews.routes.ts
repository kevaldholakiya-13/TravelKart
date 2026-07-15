import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess, sendError } from '../utils/helpers';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Mock Review model
interface IReview {
  _id?: string;
  product: string;
  user: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: Date;
  userName: string;
  userAvatar?: string;
}

const reviews: IReview[] = [];

// Get Reviews for Product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = 'recent', rating } = req.query;

    let filteredReviews = reviews.filter(r => r.product === productId);

    if (rating) {
      filteredReviews = filteredReviews.filter(r => r.rating === Number(rating));
    }

    if (sort === 'helpful') {
      filteredReviews.sort((a, b) => b.helpful - a.helpful);
    } else {
      filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const stats = {
      averageRating: filteredReviews.length ? 
        (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1) : 0,
      totalReviews: filteredReviews.length,
      ratingDistribution: {
        5: filteredReviews.filter(r => r.rating === 5).length,
        4: filteredReviews.filter(r => r.rating === 4).length,
        3: filteredReviews.filter(r => r.rating === 3).length,
        2: filteredReviews.filter(r => r.rating === 2).length,
        1: filteredReviews.filter(r => r.rating === 1).length,
      },
    };

    sendSuccess(res, 200, 'Reviews retrieved', {
      reviews: filteredReviews,
      stats,
    });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving reviews', error);
  }
});

// Create Review
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return sendError(res, 400, 'Missing required fields');
    }

    if (rating < 1 || rating > 5) {
      return sendError(res, 400, 'Rating must be between 1 and 5');
    }

    const review: IReview = {
      _id: new mongoose.Types.ObjectId().toString(),
      product: productId,
      user: req.userId || '',
      rating,
      comment,
      helpful: 0,
      createdAt: new Date(),
      userName: req.user?.name || 'Anonymous',
      userAvatar: req.user?.avatar,
    };

    reviews.push(review);

    sendSuccess(res, 201, 'Review created successfully', { review });
  } catch (error: any) {
    sendError(res, 500, 'Error creating review', error);
  }
});

// Update Review
router.put('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = reviews.find(r => r._id === id);
    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (review.user !== req.userId) {
      return sendError(res, 403, 'Unauthorized to update this review');
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    sendSuccess(res, 200, 'Review updated successfully', { review });
  } catch (error: any) {
    sendError(res, 500, 'Error updating review', error);
  }
});

// Delete Review
router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const index = reviews.findIndex(r => r._id === id);
    if (index === -1) {
      return sendError(res, 404, 'Review not found');
    }

    if (reviews[index].user !== req.userId) {
      return sendError(res, 403, 'Unauthorized to delete this review');
    }

    reviews.splice(index, 1);

    sendSuccess(res, 200, 'Review deleted successfully');
  } catch (error: any) {
    sendError(res, 500, 'Error deleting review', error);
  }
});

// Mark Helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const review = reviews.find(r => r._id === id);
    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    review.helpful += 1;

    sendSuccess(res, 200, 'Review marked helpful', { review });
  } catch (error: any) {
    sendError(res, 500, 'Error marking helpful', error);
  }
});

export default router;
