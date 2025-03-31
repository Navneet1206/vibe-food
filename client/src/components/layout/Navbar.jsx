import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

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
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-primary">GatiyanFood</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                to="/restaurants"
                                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Restaurants
                            </Link>
                            <Link
                                to="/menu"
                                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Menu
                            </Link>
                            <Link
                                to="/about"
                                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {renderAuthLinks()}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            Home
                        </Link>
                        <Link
                            to="/restaurants"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            Restaurants
                        </Link>
                        <Link
                            to="/menu"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            Menu
                        </Link>
                        <Link
                            to="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            Contact
                        </Link>
                        {renderAuthLinks()}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 