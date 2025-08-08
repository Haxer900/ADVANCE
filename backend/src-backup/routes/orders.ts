import { Router } from 'express';
import { Order, Cart, Product } from '../models';
import { z } from 'zod';

const router = Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderSchema = z.object({
      sessionId: z.string(),
      userId: z.string().optional(),
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        variant: z.object({
          size: z.string().optional(),
          color: z.string().optional(),
          material: z.string().optional()
        }).optional()
      })),
      shippingAddress: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string().default('India')
      }),
      total: z.number().positive(),
      notes: z.string().optional()
    });
    
    const validatedData = orderSchema.parse(req.body);
    
    // Calculate total from products
    let calculatedTotal = 0;
    const orderItems = [];
    
    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      
      const itemPrice = product.price;
      calculatedTotal += itemPrice * item.quantity;
      
      orderItems.push({
        productId: item.productId,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        variant: item.variant
      });
    }
    
    const order = new Order({
      ...validatedData,
      items: orderItems,
      total: calculatedTotal,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    await order.save();
    
    // Clear cart after successful order
    if (validatedData.sessionId) {
      await Cart.deleteMany({ sessionId: validatedData.sessionId });
    }
    
    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid order data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get orders by session ID
router.get('/session/:sessionId', async (req, res) => {
  try {
    const orders = await Order.find({ sessionId: req.params.sessionId })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export { router as ordersRouter };