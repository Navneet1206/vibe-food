import { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/delivery/orders`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_API_URL}/delivery/orders/${orderId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchOrders();
        } catch (err) {
            setError('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'assigned':
                return 'bg-blue-100 text-blue-800';
            case 'picked_up':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_transit':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Orders</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-lg shadow-soft overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Order #{order.order.orderNumber}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Restaurant</h3>
                                    <p className="text-sm text-gray-900">{order.order.restaurant.name}</p>
                                    <p className="text-sm text-gray-500">{order.order.restaurant.address}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                                    <p className="text-sm text-gray-900">{order.order.customer.name}</p>
                                    <p className="text-sm text-gray-500">{order.order.deliveryAddress}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Order Amount</h3>
                                    <p className="text-sm text-gray-900">₹{order.order.totalAmount}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-primary hover:text-primary-dark text-sm"
                                >
                                    View Details
                                </button>
                                {order.status === 'assigned' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'picked_up')}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                                    >
                                        Mark as Picked Up
                                    </button>
                                )}
                                {order.status === 'picked_up' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'in_transit')}
                                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
                                    >
                                        Start Delivery
                                    </button>
                                )}
                                {order.status === 'in_transit' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Order Details</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 hover:text-gray-700"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Restaurant Information</h3>
                                <p>Name: {selectedOrder.order.restaurant.name}</p>
                                <p>Phone: {selectedOrder.order.restaurant.phone}</p>
                                <p>Address: {selectedOrder.order.restaurant.address}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                                <p>Name: {selectedOrder.order.customer.name}</p>
                                <p>Phone: {selectedOrder.order.customer.phone}</p>
                                <p>Address: {selectedOrder.order.deliveryAddress}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center"
                                        >
                                            <span>{item.name}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total Amount:</span>
                                    <span className="font-semibold">
                                        ₹{selectedOrder.order.totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryOrders; 