import { Router } from 'express';
import { Product, Category, User, Order, Review, Newsletter } from '../models';
import bcrypt from 'bcryptjs';

const router = Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if this is the default admin
    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'yashparmar77077@gmail.com';
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'Yash@23072005';
    
    if (email === defaultAdminEmail && password === defaultAdminPassword) {
      return res.json({
        user: {
          id: 'admin',
          email: defaultAdminEmail,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        },
        token: 'admin-token-' + Date.now()
      });
    }
    
    // Check database for admin user
    const user = await User.findOne({ email, role: 'admin', isActive: true });
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: 'admin-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      newsletterSubscribers
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'confirmed'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(result => result[0]?.total || 0),
      Order.countDocuments({ status: 'pending' }),
      Newsletter.countDocuments({ isActive: true })
    ]);
    
    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      newsletterSubscribers,
      conversionRate: totalOrders > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : '0.0'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    
    const orders = await Order.find(filter)
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));
    
    const total = await Order.countDocuments(filter);
    
    res.json({
      orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin)
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber, notes },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export { router as adminRouter };