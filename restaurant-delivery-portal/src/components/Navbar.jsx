import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiList, FiShoppingBag, FiBarChart2, FiSettings, FiMap } from 'react-icons/fi';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, role } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate(`/${role}/login`);
    };

    const restaurantNavItems = [
        { path: '/restaurant/dashboard', label: 'Dashboard', icon: <FiHome /> },
        { path: '/restaurant/menu', label: 'Menu', icon: <FiList /> },
        { path: '/restaurant/orders', label: 'Orders', icon: <FiShoppingBag /> },
        { path: '/restaurant/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
        { path: '/restaurant/settings', label: 'Settings', icon: <FiSettings /> },
    ];

    const deliveryNavItems = [
        { path: '/delivery/dashboard', label: 'Dashboard', icon: <FiHome /> },
        { path: '/delivery/orders', label: 'Orders', icon: <FiShoppingBag /> },
        { path: '/delivery/profile', label: 'Profile', icon: <FiUser /> },
    ];

    const navItems = role === 'restaurant' ? restaurantNavItems : deliveryNavItems;

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to={`/${role}/dashboard`} className="text-2xl font-bold text-orange-500">
                                VibeFood
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === item.path
                                            ? 'border-orange-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="ml-3 relative">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">{user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    <FiLogOut className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                        >
                            {isOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === item.path
                                    ? 'bg-orange-50 border-orange-500 text-orange-700'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="flex items-center">
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    ))}
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <FiUser className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    <FiLogOut className="mr-2" />
                                    Logout
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 