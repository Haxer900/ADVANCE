import { Express } from 'express';
import { productsRouter } from './products';
import { categoriesRouter } from './categories';
import { cartRouter } from './cart';
import { ordersRouter } from './orders';
import { usersRouter } from './users';
import { newsletterRouter } from './newsletter';
import { wishlistRouter } from './wishlist';
import { reviewsRouter } from './reviews';
import { couponsRouter } from './coupons';
import { settingsRouter } from './settings';
import { adminRouter } from './admin';

export function setupRoutes(app: Express): void {
  // API routes
  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/wishlist', wishlistRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/coupons', couponsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/admin', adminRouter);
}