import { Router } from 'express';
import { Wishlist } from '../models';

const router = Router();

// Get wishlist for session
router.get('/:sessionId', async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ sessionId: req.params.sessionId })
      .populate('productId')
      .sort({ createdAt: -1 });
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add item to wishlist
router.post('/', async (req, res) => {
  try {
    const { sessionId, productId, userId } = req.body;
    
    // Check if item already exists
    const existing = await Wishlist.findOne({ sessionId, productId });
    if (existing) {
      return res.status(409).json({ error: 'Item already in wishlist' });
    }
    
    const wishlistItem = new Wishlist({ sessionId, productId, userId });
    await wishlistItem.save();
    
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:id', async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findByIdAndDelete(req.params.id);
    
    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
});

export { router as wishlistRouter };