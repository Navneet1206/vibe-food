import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Cart from '../Cart';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const renderAuthLinks = () => {
        if (!isAuthenticated) {
            return (
                <>
                    <Link
                        to="/login"
                        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Register
                    </Link>
                </>
            );
        }

        return (
            <>
                {user?.role === 'admin' && (
                    <Link
                        to="/admin/dashboard"
                        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Admin Dashboard
                    </Link>
                )}
                {user?.role === 'vendor' && (
                    <Link
                        to="/vendor/dashboard"
                        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Vendor Dashboard
                    </Link>
                )}
                {user?.role === 'deliveryBoy' && (
                    <Link
                        to="/delivery/dashboard"
                        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Delivery Dashboard
                    </Link>
                )}
                {user?.role === 'user' && (
                    <>
                        <Link
                            to="/orders"
                            className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                        >
                            My Orders
                        </Link>
                        <Link
                            to="/profile"
                            className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Profile
                        </Link>
                    </>
                )}
                <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                    Logout
                </button>
            </>
        );
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold text-primary">VibeFood</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary">
                            Home
                        </Link>
                        <Link to="/restaurants" className="text-gray-600 hover:text-primary">
                            Restaurants
                        </Link>
                        <Link to="/menu" className="text-gray-600 hover:text-primary">
                            Menu
                        </Link>
                        <Link to="/about" className="text-gray-600 hover:text-primary">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-primary">
                            Contact
                        </Link>
                    </div>

                    {/* Auth & Cart */}
                    <div className="flex items-center space-x-4">
                        <Cart />
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={user?.role === 'user' ? '/profile' :
                                        user?.role === 'vendor' ? '/vendor/dashboard' :
                                            user?.role === 'admin' ? '/admin/dashboard' :
                                                user?.role === 'delivery' ? '/delivery/dashboard' : '/profile'}
                                    className="text-gray-600 hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/logout"
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 