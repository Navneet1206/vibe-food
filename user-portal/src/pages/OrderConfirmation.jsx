import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTruck, FiMapPin } from 'react-icons/fi';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // In a real app, you would fetch order details from the backend
        // For now, we'll use mock data
        setOrderDetails({
            orderId: 'ORD123456',
            status: 'confirmed',
            estimatedDelivery: '30-40 min',
            restaurantName: 'Pizza Palace',
            items: [
                {
                    name: 'Margherita Pizza',
                    quantity: 2,
                    price: 299
                }
            ],
            total: 598,
            deliveryFee: 40,
            address: '123 Food Street, Cuisine Lane',
            paymentMethod: 'online'
        });
    }, []);

    if (!orderDetails) return <div className="pt-20">Loading...</div>;

    return (
        <div className="pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">Thank you for your order</p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID</span>
                                <span className="font-medium">{orderDetails.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Restaurant</span>
                                <span className="font-medium">{orderDetails.restaurantName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Estimated Delivery</span>
                                <span className="font-medium">{orderDetails.estimatedDelivery}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium capitalize">{orderDetails.paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {orderDetails.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
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
                                    <span>₹{orderDetails.total}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Delivery Fee</span>
                                    <span>₹{orderDetails.deliveryFee}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>₹{orderDetails.total + orderDetails.deliveryFee}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                        <div className="flex items-start space-x-3">
                            <FiMapPin className="w-5 h-5 text-gray-500 mt-1" />
                            <p className="text-gray-600">{orderDetails.address}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/orders')}
                            className="flex-1 bg-primary text-white py-3 rounded-md hover:bg-primary-dark"
                        >
                            Track Order
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md hover:bg-gray-200"
                        >
                            Continue Ordering
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation; 