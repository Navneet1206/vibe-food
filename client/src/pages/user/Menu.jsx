import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants/menu`);
                if (response.data && Array.isArray(response.data)) {
                    setMenuItems(response.data);
                    setFilteredItems(response.data);

                    // Extract unique categories
                    const uniqueCategories = [...new Set(response.data.map(item => item.category))];
                    setCategories(uniqueCategories);
                } else {
                    setMenuItems([]);
                    setFilteredItems([]);
                    setCategories([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching menu items:', err);
                setError('Failed to fetch menu items. Please try again later.');
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    useEffect(() => {
        if (!Array.isArray(menuItems)) {
            setFilteredItems([]);
            return;
        }

        let filtered = menuItems;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        setFilteredItems(filtered);
    }, [searchTerm, selectedCategory, menuItems]);

    const addToCart = (item) => {
        const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
        if (existingItem) {
            setCartItems(prevItems =>
                prevItems.map(cartItem =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
        }
    };

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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h1>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search menu items..."
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
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(filteredItems) && filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative h-48">
                            <img
                                src={item.image || '/images/menu-placeholder.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            {item.isVeg && (
                                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                                    Veg
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h2>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-primary font-semibold">₹{item.price}</span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!Array.isArray(filteredItems) || filteredItems.length === 0) && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No menu items found matching your search.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Menu; 