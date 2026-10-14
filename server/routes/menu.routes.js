import { Router } from 'express';
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenu,
} from '../controllers/menu.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

// GET /api/restaurants/:restaurantId/menu
router.get('/', getMenu);

// POST /api/restaurants/:restaurantId/menu/items
router.post('/items', protect, authorize('restaurant'), addMenuItem);

// PUT /api/restaurants/:restaurantId/menu/items/:itemId
router.put('/items/:itemId', protect, authorize('restaurant'), updateMenuItem);

// DELETE /api/restaurants/:restaurantId/menu/items/:itemId
router.delete('/items/:itemId', protect, authorize('restaurant'), deleteMenuItem);

export default router;
