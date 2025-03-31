import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const updateQuantity = (itemId, change) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === itemId
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-primary"
            >
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getItemCount()}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex items-center space-x-4">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/100'}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.name}</h4>
                                                <p className="text-sm text-gray-500">{item.restaurantName}</p>
                                                <p className="text-primary font-semibold">₹{item.price}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                    className="p-1 text-gray-500 hover:text-primary"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="p-1 text-gray-500 hover:text-primary"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="p-1 text-red-500 hover:text-red-600"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between mb-4">
                                        <span className="font-semibold">Total:</span>
                                        <span className="font-semibold">₹{getTotal()}</span>
                                    </div>
                                    {isAuthenticated ? (
                                        <Link
                                            to="/checkout"
                                            className="block w-full bg-primary text-white py-2 px-4 rounded-lg text-center hover:bg-primary-dark"
                                        >
                                            Proceed to Checkout
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="block w-full bg-primary text-white py-2 px-4 rounded-lg text-center hover:bg-primary-dark"
                                        >
                                            Login to Checkout
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart; 