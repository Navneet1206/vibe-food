import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for restaurants
    const restaurants = [
        {
            id: 1,
            name: "Pizza Palace",
            cuisine: "Italian",
            rating: 4.5,
            deliveryTime: "30-40 min",
            minOrder: "₹200",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        // Add more restaurant data here
    ];

    // Mock data for food categories
    const categories = [
        { id: 1, name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
        { id: 2, name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
        { id: 3, name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
        // Add more categories here
    ];

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <div className="relative h-[500px] bg-gradient-to-r from-primary to-primary-dark">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-5xl font-bold mb-6">Discover the best food & drinks</h1>
                        <div className="flex items-center bg-white rounded-lg p-2">
                            <FiMapPin className="text-gray-500 ml-2" />
                            <input
                                type="text"
                                placeholder="Search for restaurant, cuisine or a dish"
                                className="flex-1 px-4 py-2 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark">
                                <FiSearch className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={20}
                    slidesPerView={2}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 6 },
                    }}
                >
                    {categories.map((category) => (
                        <SwiperSlide key={category.id}>
                            <div className="relative h-32 rounded-lg overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <span className="text-white font-semibold">{category.name}</span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Restaurants Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6">Popular Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {restaurants.map((restaurant) => (
                        <Link
                            to={`/restaurant/${restaurant.id}`}
                            key={restaurant.id}
                            className="bg-white rounded-lg shadow-custom overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center">
                                        <span className="text-yellow-500 mr-1">★</span>
                                        {restaurant.rating}
                                    </span>
                                    <span>{restaurant.deliveryTime}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    Min. order: {restaurant.minOrder}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home; 