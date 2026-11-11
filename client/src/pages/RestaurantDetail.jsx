import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const RestaurantDetail = () => {
    const { id } = useParams(); // Gets the ID from the URL
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch restaurant and menu in parallel
                const res = await api.get(`/restaurants/${id}`);
                setRestaurant(res.data.restaurant);
                setMenu(res.data.menu);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleAddToCart = async (itemId) => {
        try {
            await api.post('/cart/items', {
            restaurantId: id, // The restaurant ID from the URL
            itemId: itemId,   // The specific menu item
            quantity: 1
            });
            alert('Item added to cart!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to add to cart. Are you logged in?');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!restaurant) return <div className="text-center mt-10 text-red-500">Restaurant not found</div>

    return(
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <Link to="/restaurants" className="text-orange-500 hover:underline mb-4 inline-block">
                &larr; Back to Restaurants
            </Link>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <p className="text-gray-600">{restaurant.cuisine.join(', ')}</p>
                <p className="text-gray-500 mt-2">{restaurant.description}</p>
            </div> 
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            {!menu || menu.items.length === 0 ? (
                <p>No items on the menu yet.</p>
            ) : (
                <div className="space-y-4">
                    {menu.items.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-100">
                            <div>
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                                <p className="font-semibold mt-1">₹{item.price}</p>
                            </div>
                            <button onClick={() => handleAddToCart(item._id)}
                            style={{ backgroundColor: '#f97316', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}           
        </div>
    );
};

export default RestaurantDetail;


