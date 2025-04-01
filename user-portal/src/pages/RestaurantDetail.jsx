import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiStar, FiClock, FiTruck, FiMinus, FiPlus } from 'react-icons/fi';
import { addToCart } from '../store/slices/cartSlice';

const RestaurantDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mock data - Replace with API call
    useEffect(() => {
        setRestaurant({
            id: 1,
            name: "Pizza Palace",
            cuisine: "Italian",
            rating: 4.5,
            deliveryTime: "30-40 min",
            minOrder: "₹200",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            description: "Authentic Italian cuisine with a modern twist",
            address: "123 Food Street, Cuisine Lane",
            isOpen: true
        });

        setMenuItems([
            {
                id: 1,
                name: "Margherita Pizza",
                description: "Classic tomato sauce with mozzarella and basil",
                price: 299,
                category: "Pizza",
                image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            },
            {
                id: 2,
                name: "Pepperoni Pizza",
                description: "Spicy pepperoni with cheese and tomato sauce",
                price: 399,
                category: "Pizza",
                image: "https://images.unsplash.com/photo-1628840042765-356c34907535?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            },
            // Add more menu items
        ]);
    }, [id]);

    const categories = ['all', ...new Set(menuItems.map(item => item.category))];

    const filteredMenuItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const handleAddToCart = (item) => {
        dispatch(addToCart({ ...item, restaurantId: id, restaurantName: restaurant?.name }));
    };

    if (!restaurant) return <div className="pt-20">Loading...</div>;

    return (
        <div className="pt-20">
            {/* Restaurant Header */}
            <div className="relative h-64">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                        <p className="text-gray-600">{restaurant.cuisine}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center">
                                <FiStar className="text-yellow-500 mr-1" />
                                {restaurant.rating}
                            </span>
                            <span className="flex items-center">
                                <FiClock className="mr-1" />
                                {restaurant.deliveryTime}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className={`px-4 py-2 rounded-full ${restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {restaurant.isOpen ? 'Open' : 'Closed'}
                        </span>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredMenuItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">₹{item.price}</span>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail; 