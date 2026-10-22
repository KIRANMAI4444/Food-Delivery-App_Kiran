import Cart from '../models/Cart.js';
import Restaurant from '../models/Restaurant.js';
import Menu from '../models/Menu.js';

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private (customer)
export const addToCart = async (req, res) => {
  try {
    const { restaurantId, itemId, quantity = 1 } = req.body;

    if (!restaurantId || !itemId) {
      return res.status(400).json({ message: 'restaurantId and itemId are required' });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Verify item exists in that restaurant's menu
    const menu = await Menu.findOne({ restaurant: restaurantId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const menuItem = menu.items.id(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Item not found in menu' });
    }

    if (!menuItem.isAvailable) {
      return res.status(400).json({ message: 'Item is currently unavailable' });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // If cart has items from a different restaurant, reset it
    if (cart && cart.restaurant && cart.restaurant.toString() !== restaurantId) {
      cart.items = [];
      cart.restaurant = restaurantId;
    }

    // If no cart exists, create one
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        restaurant: restaurantId,
        items: [],
      });
    }

    // Check if item is already in cart
    const existingItem = cart.items.find(
      (i) => i.menuItem && i.menuItem.toString() === itemId
    );

    if (existingItem) {
      // Increment quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });
    }

    await cart.save();

    res.json({ cart });
  } catch (err) {
    console.error('Add to cart error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get user's current cart
// @route   GET /api/cart
// @access  Private (customer)
export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'restaurant',
      'name image deliveryFee'
    );
    res.json({ cart: cart || { items: [], totalPrice: 0 } });
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update quantity of an item
// @route   PUT /api/cart/items/:itemId
// @access  Private (customer)
export const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Find the cart item by its menuItem id
    const cartItem = cart.items.find(
      (i) => i.menuItem && i.menuItem.toString() === itemId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    cartItem.quantity = quantity;
    await cart.save();

    res.json({ cart });
  } catch (err) {
    console.error('Update quantity error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private (customer)
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Filter out the item
    cart.items = cart.items.filter(
      (i) => !i.menuItem || i.menuItem.toString() !== itemId
    );

    await cart.save();

    res.json({ cart });
  } catch (err) {
    console.error('Remove from cart error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private (customer)
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ message: 'Cart already empty' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    console.error('Clear cart error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
