import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [placingOrder, setPlacingOrder] = useState(false);

    const navigate = useNavigate();

    // Form state
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('/cart');
                if (!res.data.cart || res.data.cart.items.length === 0) {
                    navigate('/cart'); // Redirect if empty
                    return;
                }
                setCart(res.data.cart);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');
        setPlacingOrder(true);

        try {
            await api.post('/orders', {
            deliveryAddress: { street, city, pincode },
            paymentMethod
            });     
            // Order placed successfully! Redirect to home.
            alert('Order placed successfully!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>     
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>    
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-gray-700 mb-1">Street</label>
                        <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">City</label>
                        <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Pincode</label>
                        <input type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="mb-6 space-y-2">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Cash on Delivery
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Credit/Debit Card
                    </label>
                </div>

                <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold">
                        <span>Grand Total:</span>
                        <span>₹{cart.totalPrice + (cart.restaurant?.deliveryFee || 0)}</span>
                    </div>
                </div>

                <button
                  type="submit"
                  disabled={placingOrder}
                  style={{ backgroundColor: '#f97316', color: 'white', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                >
                    {placingOrder ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                </button>
            </form>
        </div>
    );                                   
};

export default Checkout;