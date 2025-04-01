import { useState, useEffect } from 'react';
import { FiMapPin, FiClock, FiNavigation, FiCheck, FiX } from 'react-icons/fi';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all'); // all, available, accepted, picked_up, delivered
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Simulate fetching orders
        const fetchOrders = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOrders([
                {
                    id: '1',
                    restaurantName: 'Pizza Place',
                    restaurantAddress: '123 Main St, City',
                    customerName: 'John Doe',
                    customerAddress: '456 Oak Ave, City',
                    items: [
                        { name: 'Margherita Pizza', quantity: 1 },
                        { name: 'Coca Cola', quantity: 2 },
                    ],
                    total: 18.97,
                    status: 'available',
                    orderTime: '2024-01-20T10:30:00',
                    estimatedDistance: '2.5 km',
                    estimatedTime: '15 mins',
                },
                {
                    id: '2',
                    restaurantName: 'Burger Joint',
                    restaurantAddress: '789 Pine St, City',
                    customerName: 'Jane Smith',
                    customerAddress: '321 Elm St, City',
                    items: [
                        { name: 'Chicken Burger', quantity: 2 },
                        { name: 'French Fries', quantity: 1 },
                    ],
                    total: 21.97,
                    status: 'accepted',
                    orderTime: '2024-01-20T10:25:00',
                    estimatedDistance: '3.2 km',
                    estimatedTime: '20 mins',
                },
            ]);
        };

        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId
                    ? { ...order, status: newStatus }
                    : order
            )
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'accepted':
                return 'bg-blue-100 text-blue-800';
            case 'picked_up':
                return 'bg-yellow-100 text-yellow-800';
            case 'delivered':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsOnline(!isOnline)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isOnline ? 'bg-orange-500' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOnline ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Orders</option>
                        <option value="available">Available</option>
                        <option value="accepted">Accepted</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Available Orders</h2>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <li key={order.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {order.customerName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {order.customerName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Order #{order.id}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FiClock className="mr-1 h-4 w-4" />
                                                {new Date(order.orderTime).toLocaleTimeString()}
                                            </div>
                                            <div className="mt-1">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <FiMapPin className="mr-1 h-4 w-4" />
                                                    <span className="font-medium text-gray-900">Pickup:</span>
                                                    <span className="ml-1">{order.restaurantName}</span>
                                                </div>
                                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                                    <FiMapPin className="mr-1 h-4 w-4" />
                                                    <span className="font-medium text-gray-900">Delivery:</span>
                                                    <span className="ml-1">{order.customerAddress}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <h4 className="text-sm font-medium text-gray-900">Order Items</h4>
                                                <ul className="mt-1 text-sm text-gray-500">
                                                    {order.items.map((item, index) => (
                                                        <li key={index}>
                                                            {item.quantity}x {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="mt-2 text-sm font-medium text-gray-900">
                                                    Total: ${order.total}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <FiNavigation className="mr-1 h-4 w-4" />
                                                {order.estimatedDistance} • {order.estimatedTime}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                                        {order.status === 'available' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'accepted')}
                                                className="btn-primary"
                                            >
                                                Accept Order
                                            </button>
                                        )}
                                        {order.status === 'accepted' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                                                className="btn-primary"
                                            >
                                                Mark as Picked Up
                                            </button>
                                        )}
                                        {order.status === 'picked_up' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                                className="btn-primary"
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Orders; 