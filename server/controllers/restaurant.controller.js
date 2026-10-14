import Restaurant from '../models/Restaurant.js';
import Menu from '../models/Menu.js';

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private (restaurant role)
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisine,
      address,
      image,
      deliveryTime,
      deliveryFee,
    } = req.body;

    // Basic validation
    if (!name || !cuisine || !address) {
      return res.status(400).json({ message: 'Name, cuisine, and address are required' });
    }

    // Check: one user can own only one restaurant (for now)
    const existing = await Restaurant.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You already own a restaurant' });
    }

    // Create restaurant
    const restaurant = await Restaurant.create({
      name,
      description,
      cuisine,
      address,
      image,
      deliveryTime,
      deliveryFee,
      owner: req.user._id,
    });

    // Auto-create an empty menu for this restaurant
    await Menu.create({
      restaurant: restaurant._id,
      items: [],
    });

    res.status(201).json({ restaurant });
  } catch (err) {
    console.error('Create restaurant error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).sort({ createdAt: -1 });
    res.json({ count: restaurants.length, restaurants });
  } catch (err) {
    console.error('Get restaurants error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get a single restaurant by ID (with its menu)
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menu = await Menu.findOne({ restaurant: restaurant._id });

    res.json({ restaurant, menu });
  } catch (err) {
    console.error('Get restaurant error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (owner only)
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this restaurant' });
    }

    const updates = ['name', 'description', 'cuisine', 'address', 'image', 'isOpen', 'deliveryTime', 'deliveryFee'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    await restaurant.save();

    res.json({ restaurant });
  } catch (err) {
    console.error('Update restaurant error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (owner only)
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
    }

    // Also delete its menu
    await Menu.findOneAndDelete({ restaurant: restaurant._id });

    // Delete the restaurant
    await restaurant.deleteOne();

    res.json({ message: 'Restaurant and its menu deleted' });
  } catch (err) {
    console.error('Delete restaurant error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};