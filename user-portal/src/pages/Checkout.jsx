import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiCash } from 'react-icons/fi';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total, deliveryFee } = useSelector(state => state.cart);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would typically:
            // 1. Validate the form
            // 2. Send order to backend
            // 3. Handle payment processing
            // 4. Show success message

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Clear cart and redirect to order confirmation
            dispatch(clearCart());
            navigate('/order-confirmation');
        } catch (error) {
            console.error('Order submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-20">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Delivery Address */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery Address
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        rows="3"
                                        placeholder="Enter your complete delivery address"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Payment Method
                                    </label>
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                value="online"
                                                checked={paymentMethod === 'online'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <div className="flex items-center">
                                                <FiCreditCard className="w-5 h-5 mr-2" />
                                                <span>Online Payment</span>
                                            </div>
                                        </label>
                                        <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                value="cash"
                                                checked={paymentMethod === 'cash'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <div className="flex items-center">
                                                <FiCash className="w-5 h-5 mr-2" />
                                                <span>Cash on Delivery</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                    </div>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>₹{total + deliveryFee}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 