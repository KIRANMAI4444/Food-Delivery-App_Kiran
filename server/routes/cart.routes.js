import { Router } from 'express';
import {
  addToCart,
  getMyCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// All cart routes are protected and restricted to customers
router.use(protect);
router.use(authorize('customer'));

// Routes
router.get('/', getMyCart);
router.post('/items', addToCart);
router.put('/items/:itemId', updateQuantity);
router.delete('/items/:itemId', removeFromCart);
router.delete('/', clearCart);

export default router;
