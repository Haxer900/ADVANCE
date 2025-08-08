import express from 'express';
const router = express.Router();
router.post('/', (req, res) => res.json({ message: 'Newsletter subscription added' }));
export { router as newsletterRoutes };