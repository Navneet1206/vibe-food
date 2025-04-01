import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold text-primary">GatiyanFood</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/restaurants" className="text-gray-700 hover:text-primary">
                            Restaurants
                        </Link>
                        <Link to="/orders" className="text-gray-700 hover:text-primary">
                            Orders
                        </Link>
                        <Link to="/cart" className="text-gray-700 hover:text-primary">
                            <FiShoppingCart className="w-6 h-6" />
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-primary">
                            <FiUser className="w-6 h-6" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <FiX className="w-6 h-6" />
                        ) : (
                            <FiMenu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                to="/restaurants"
                                className="block px-3 py-2 text-gray-700 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Restaurants
                            </Link>
                            <Link
                                to="/orders"
                                className="block px-3 py-2 text-gray-700 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Orders
                            </Link>
                            <Link
                                to="/cart"
                                className="block px-3 py-2 text-gray-700 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Cart
                            </Link>
                            <Link
                                to="/profile"
                                className="block px-3 py-2 text-gray-700 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Profile
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 