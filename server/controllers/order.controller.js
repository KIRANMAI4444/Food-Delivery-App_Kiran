
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Place a new order (from cart)
// @route   POST /api/orders
// @access  Private (customer)
export const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    // Validate address
    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({ message: 'Complete delivery address is required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('restaurant');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    const deliveryFee = cart.restaurant.deliveryFee || 0;
    const totalPrice = cart.totalPrice;
    const grandTotal = totalPrice + deliveryFee;

    // Create order (snapshot items from cart)
    const order = await Order.create({
      user: req.user._id,
      restaurant: cart.restaurant._id,
      items: cart.items.map((item) => ({
        menuItem: item.menuItem,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
      deliveryFee,
      grandTotal,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      status: 'placed',
      paymentStatus: 'pending',
    });

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ order });
  } catch (err) {
    console.error('Place order error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private (customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 }); // newest first
    res.json({ count: orders.length, orders });
  } catch (err) {
    console.error('Get my orders error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get orders for a restaurant
// @route   GET /api/orders/restaurant
// @access  Private (restaurant owner)
export const getRestaurantOrders = async (req, res) => {
  try {
    // Find the restaurant owned by this user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'You do not own a restaurant' });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ count: orders.length, orders });
  } catch (err) {
    console.error('Get restaurant orders error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (restaurant owner)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Valid statuses
    const validStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    const restaurant = await Restaurant.findById(order.restaurant);
    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update status
    order.status = status;
    await order.save();

    res.json({ order });
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
