import { Router } from 'express';
import { Newsletter } from '../models';
import { z } from 'zod';

const router = Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const subscribeSchema = z.object({
      email: z.string().email('Invalid email address')
    });
    
    const { email } = subscribeSchema.parse(req.body);
    
    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(409).json({ error: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        await existing.save();
        return res.json({ message: 'Subscription reactivated successfully' });
      }
    }
    
    // Create new subscription
    const subscription = new Newsletter({ email });
    await subscription.save();
    
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscription = await Newsletter.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );
    
    if (!subscription) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export { router as newsletterRouter };