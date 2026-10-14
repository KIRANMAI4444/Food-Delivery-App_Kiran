import Menu from "../models/Menu.js";
import Restaurant from "../models/Restaurant.js";

// Helper: check if the logged-in user owns this restaurant
const verifyOwnership = async (restaurantId, userId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return { error: 'Restaurant not found', status: 404 };
  if (restaurant.owner.toString() !== userId.toString()) {
    return { error: 'Not authorized for this restaurant', status: 403 };
  }
  return { restaurant };
};

// @desc    Add an item to the menu
// @route   POST /api/restaurants/:restaurantId/menu/items
// @access  Private (restaurant owner)
export const addMenuItem = async (req, res) => {
    try{
        const { restaurantId } = req.params;

        // Check ownership
        const check = await verifyOwnership(restaurantId, req.user._id);
        if (check.error) {
            return res.status(check.status).json({ message: check.error });
        }

        // Validate item fields
        const { name, price, category } = req.body;
        if (!name || price === undefined || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required' });
        }

        // Find or create the menu
        let menu = await Menu.findOne({ restaurant: restaurantId });
        if (!menu) {
            menu = await Menu.create({ restaurant: restaurantId, items: [] });
        }

        // Add item
        menu.items.push(req.body);
        await menu.save();

        // Get the newly added item (last one)
        const newItem = menu.items[menu.items.length - 1];

        res.status(201).json({ item: newItem, menu });

    }catch (err) {
        console.error('Add menu item error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Update a menu item
// @route   PUT /api/restaurants/:restaurantId/menu/items/:itemId
// @access  Private (restaurant owner)
export const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;

    const check = await verifyOwnership(restaurantId, req.user._id);
    if (check.error) {
      return res.status(check.status).json({ message: check.error });
    }

    const menu = await Menu.findOne({ restaurant: restaurantId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const item = menu.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update allowed fields
    const updatable = ['name', 'description', 'price', 'category', 'image', 'isVeg', 'isAvailable'];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await menu.save();

    res.json({ item, menu });
  } catch (err) {
    console.error('Update menu item error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
