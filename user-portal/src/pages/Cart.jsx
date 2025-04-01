import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, restaurantName, total, deliveryFee } = useSelector(state => state.cart);

    const handleQuantityChange = (itemId, change) => {
        const item = items.find(item => item.id === itemId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0) {
                dispatch(updateQuantity({ itemId, quantity: newQuantity }));
            }
        }
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleCheckout = () => {
        // Navigate to checkout page or show checkout modal
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="pt-20">
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some delicious food to your cart!</p>
                    <button
                        onClick={() => navigate('/restaurants')}
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
                    >
                        Browse Restaurants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Your Cart</h1>
                    <button
                        onClick={() => dispatch(clearCart())}
                        className="text-red-500 hover:text-red-700"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">{restaurantName}</h2>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between py-4 border-b last:border-b-0"
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-600">₹{item.price}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.id, -1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <FiMinus className="w-5 h-5" />
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.id, 1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹{total + deliveryFee}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-white py-3 rounded-md mt-6 hover:bg-primary-dark"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart; 