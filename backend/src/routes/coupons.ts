import { Router } from 'express';
import { Coupon } from '../models';

const router = Router();

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    });
    
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }
    
    if (orderTotal < coupon.minimumOrder) {
      return res.status(400).json({ 
        error: `Minimum order value of ₹${coupon.minimumOrder} required` 
      });
    }
    
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.min(
        (orderTotal * coupon.value) / 100,
        coupon.maxDiscount || orderTotal
      );
    } else {
      discountAmount = Math.min(coupon.value, orderTotal);
    }
    
    res.json({
      coupon: {
        id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      },
      discountAmount,
      finalTotal: orderTotal - discountAmount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

export { router as couponsRouter };