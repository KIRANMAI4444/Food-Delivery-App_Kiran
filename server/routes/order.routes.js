import { Router } from 'express';
import {
  placeOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Customer routes
router.post('/', protect, authorize('customer'), placeOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);

// Restaurant owner routes
router.get('/restaurant', protect, authorize('restaurant'), getRestaurantOrders);
router.put('/:id/status', protect, authorize('restaurant'), updateOrderStatus);

export default router;
