import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants`);
                setRestaurants(response.data);
                setFilteredRestaurants(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch restaurants');
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    useEffect(() => {
        const filtered = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    }, [searchTerm, restaurants]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Restaurants</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search restaurants or cuisines..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                    <Link
                        key={restaurant._id}
                        to={`/restaurants/${restaurant._id}`}
                        className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative h-48">
                            <img
                                src={restaurant.image || 'https://via.placeholder.com/400x200'}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
                                {restaurant.rating} ★
                            </div>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {restaurant.name}
                            </h2>
                            <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                            <div className="flex items-center text-gray-500 text-sm">
                                <svg
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                {restaurant.address}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-primary font-semibold">
                                    {restaurant.deliveryTime} min
                                </span>
                                <span className="text-gray-600">
                                    Min. ₹{restaurant.minOrder}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredRestaurants.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No restaurants found matching your search.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Restaurants; 