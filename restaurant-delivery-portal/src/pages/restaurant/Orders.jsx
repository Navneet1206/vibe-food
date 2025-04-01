import { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiUser, FiCheck, FiX } from 'react-icons/fi';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, preparing, ready, delivered

    useEffect(() => {
        // Simulate fetching orders
        const fetchOrders = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOrders([
                {
                    id: '1',
                    customerName: 'John Doe',
                    phoneNumber: '+1234567890',
                    address: '123 Main St, City',
                    items: [
                        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
                        { name: 'Coca Cola', quantity: 2, price: 2.99 },
                    ],
                    total: 18.97,
                    status: 'pending',
                    orderTime: '2024-01-20T10:30:00',
                    estimatedTime: '30 mins',
                },
                {
                    id: '2',
                    customerName: 'Jane Smith',
                    phoneNumber: '+1987654321',
                    address: '456 Oak Ave, City',
                    items: [
                        { name: 'Chicken Burger', quantity: 2, price: 8.99 },
                        { name: 'French Fries', quantity: 1, price: 3.99 },
                    ],
                    total: 21.97,
                    status: 'preparing',
                    orderTime: '2024-01-20T10:25:00',
                    estimatedTime: '25 mins',
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
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'preparing':
                return 'bg-blue-100 text-blue-800';
            case 'ready':
                return 'bg-green-100 text-green-800';
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
                <div className="flex space-x-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
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
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FiClock className="mr-1 h-4 w-4" />
                                                {new Date(order.orderTime).toLocaleTimeString()}
                                            </div>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <FiMapPin className="mr-1 h-4 w-4" />
                                                {order.address}
                                            </div>
                                            <div className="mt-2">
                                                <h4 className="text-sm font-medium text-gray-900">Order Items</h4>
                                                <ul className="mt-1 text-sm text-gray-500">
                                                    {order.items.map((item, index) => (
                                                        <li key={index}>
                                                            {item.quantity}x {item.name} - ${item.price}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="mt-2 text-sm font-medium text-gray-900">
                                                    Total: ${order.total}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                                className="btn-primary"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'ready')}
                                                className="btn-primary"
                                            >
                                                Mark as Ready
                                            </button>
                                        )}
                                        {order.status === 'ready' && (
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