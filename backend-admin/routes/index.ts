import { Router } from "express";
import productsRoutes from "./products.js";
import ordersRoutes from "./orders.js";
import usersRoutes from "./users.js";
import categoriesRoutes from "./categories.js";
import analyticsRoutes from "./analytics.js";
import mediaRoutes from "./media.js";
import settingsRoutes from "./settings.js";

const router = Router();

// Admin API routes
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);
router.use("/users", usersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/media", mediaRoutes);
router.use("/settings", settingsRoutes);

export default router;