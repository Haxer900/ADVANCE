import { Router } from 'express';
import { Cart, Product } from '../models';

const router = Router();

// Get cart items for session
router.get('/:sessionId', async (req, res) => {
  try {
    const cartItems = await Cart.find({ sessionId: req.params.sessionId })
      .populate('productId')
      .sort({ createdAt: -1 });
    
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { sessionId, productId, quantity = 1, variant } = req.body;
    
    // Check if item already exists in cart
    const existingItem = await Cart.findOne({ 
      sessionId, 
      productId,
      ...(variant && { variant })
    });
    
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      res.json(existingItem);
    } else {
      const cartItem = new Cart({ sessionId, productId, quantity, variant });
      await cartItem.save();
      res.status(201).json(cartItem);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart for session
router.delete('/session/:sessionId', async (req, res) => {
  try {
    await Cart.deleteMany({ sessionId: req.params.sessionId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export { router as cartRouter };