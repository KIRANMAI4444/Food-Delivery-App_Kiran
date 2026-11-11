import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the cart when the page loads
  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Change quantity (+ or -)
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow 0 or negative
    try {
      await api.put(`/cart/items/${itemId}`, { quantity: newQuantity });
      fetchCart(); // Refresh cart data
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item entirely
  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      fetchCart(); // Refresh cart data
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading cart...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/restaurants" className="text-orange-500 hover:underline">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Items from: {cart.restaurant?.name || 'Restaurant'}
            </h2>
            {cart.items.map((item) => (
                <div key={item.menuItem} className="flex justify-between items-center border-b py-4">
                    <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-gray-600">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border rounded px-2 py-1">
                            <button 
                                onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                                className="text-xl font-bold text-orange-500 hover:text-orange-700"
                            >-</button>
                            <span className="w-6 text-center font-semibold">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                                className="text-xl font-bold text-orange-500 hover:text-orange-700"
                            >+</button>
                        </div>

                        <button 
                            onClick={() => removeItem(item.menuItem)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
        {/* Checkout Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between text-lg mb-2">
              <span>Item Total:</span>
              <span>₹{cart.totalPrice}</span>
          </div>
          <div className="flex justify-between text-lg mb-2">
              <span>Delivery Fee:</span>
              <span>₹{cart.restaurant?.deliveryFee || 0}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold">
              <span>To Pay:</span>
              <span>₹{cart.totalPrice + (cart.restaurant?.deliveryFee || 0)}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')} // We will build checkout next!
            style={{ backgroundColor: '#f97316', color: 'white', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '20px' }}
          >
              Proceed to Checkout
          </button>
        </div>        
    </div>
  );
};

export default Cart;
