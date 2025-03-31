import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/orderSlice';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, error } = useSelector((state) => state.order);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-purple-100 text-purple-800';
            case 'ready':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivering':
                return 'bg-pink-100 text-pink-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Order History</h1>
                    <div className="flex space-x-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivering">Delivering</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === 'all'
                                ? "You haven't placed any orders yet."
                                : `No orders with status "${filter}" found.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white shadow overflow-hidden sm:rounded-lg"
                            >
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Order #{order._id.slice(-6)}
                                            </h3>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Restaurant</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {order.restaurant.name}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Items</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                                    {order.items.map((item) => (
                                                        <li
                                                            key={item._id}
                                                            className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                                        >
                                                            <div className="w-0 flex-1 flex items-center">
                                                                <span className="ml-2 flex-1 w-0 truncate">
                                                                    {item.name}
                                                                </span>
                                                                <span className="ml-2 flex-shrink-0 text-gray-400">
                                                                    x{item.quantity}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4 flex-shrink-0">
                                                                <span className="text-gray-900">
                                                                    ₹{item.price * item.quantity}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                ₹{order.totalAmount}
                                            </dd>
                                        </div>
                                        {order.deliveryAddress && (
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {order.deliveryAddress}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders; 