import { useState, useEffect } from 'react';
import api from '../api/axios';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() =>{
        const fetchRestaurants = async () => {
            try {
                const response = await api.get('/restaurants');
                setRestaurants(response.data.restaurants);
            } catch (err) {
                setError('Failed to load restaurants');
                console.error(err);
            } finally {
            setLoading(false);
            }
        };
        fetchRestaurants();dx       
    }, []);

    if (loading) 
        return <div className="text-center mt-10">Loading restaurants...</div>;
    if (error) 
        return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6">All Restaurants</h1>

            {restaurants.length === 0 ? (<p>No restaurants found.</p>):
            (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                    <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img 
                            src={restaurant.image} 
                            alt={restaurant.name} 
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                            <h2 className="text-xl font-bold">{restaurant.name}</h2>
                            <p className="text-gray-600 text-sm mt-1">{restaurant.cuisine.join(', ')}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="font-semibold text-green-600">₹{restaurant.deliveryFee} Delivery</span>
                                <span className="text-sm text-gray-500">{restaurant.deliveryTime} mins</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default Restaurants;