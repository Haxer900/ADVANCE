import { Router } from "express";
import productsRoutes from "./products.js";
import categoriesRoutes from "./categories.js";
import cartRoutes from "./cart.js";
import newsletterRoutes from "./newsletter.js";
import wishlistRoutes from "./wishlist.js";

const router = Router();

// Website API routes
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/cart", cartRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/wishlist", wishlistRoutes);

export default router;