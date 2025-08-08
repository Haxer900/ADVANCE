import { Router } from 'express';
import { Review } from '../models';

const router = Router();

// Get reviews for product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      productId: req.params.productId, 
      isApproved: true 
    }).sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export { router as reviewsRouter };