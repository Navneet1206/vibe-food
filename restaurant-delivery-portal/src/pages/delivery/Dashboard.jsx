import { useState, useEffect } from 'react';
import { FiDollarSign, FiMapPin, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalDeliveries: 0,
        activeDeliveries: 0,
        averageRating: 0,
    });

    const [currentOrders, setCurrentOrders] = useState([]);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            // Simulate API calls
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data
            setStats({
                totalEarnings: 1250.50,
                totalDeliveries: 45,
                activeDeliveries: 2,
                averageRating: 4.8,
            });

            setCurrentOrders([
                {
                    id: '1',
                    restaurantName: 'Pizza Place',
                    customerName: 'John Doe',
                    pickupAddress: '123 Restaurant St',
                    deliveryAddress: '456 Customer Ave',
                    distance: '2.5 km',
                    estimatedTime: '15 mins',
                    status: 'picked_up',
                },
                {
                    id: '2',
                    restaurantName: 'Burger Joint',
                    customerName: 'Jane Smith',
                    pickupAddress: '789 Food Court',
                    deliveryAddress: '321 Home St',
                    distance: '1.8 km',
                    estimatedTime: '10 mins',
                    status: 'accepted',
                },
            ]);
        };

        fetchData();
    }, []);

    const toggleOnlineStatus = () => {
        setIsOnline(!isOnline);
        // In a real app, you would make an API call to update the status
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-yellow-100 text-yellow-800';
            case 'picked_up':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <button
                    onClick={toggleOnlineStatus}
                    className={`px-4 py-2 rounded-md font-medium ${isOnline
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                >
                    {isOnline ? 'Online' : 'Offline'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiDollarSign className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Earnings
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        ${stats.totalEarnings}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiCheckCircle className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Deliveries
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        {stats.totalDeliveries}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiMapPin className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Active Deliveries
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        {stats.activeDeliveries}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiClock className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Average Rating
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        {stats.averageRating}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Orders */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Current Orders</h2>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {currentOrders.map((order) => (
                            <li key={order.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {order.restaurantName}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Customer: {order.customerName}
                                            </p>
                                            <div className="mt-1">
                                                <p className="text-sm text-gray-500">
                                                    Pickup: {order.pickupAddress}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Delivery: {order.deliveryAddress}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center space-x-4">
                                                <span className="text-sm text-gray-500">
                                                    Distance: {order.distance}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ETA: {order.estimatedTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <button className="btn-primary">
                                            {order.status === 'accepted' ? 'Pick Up' : 'Complete'}
                                        </button>
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

export default Dashboard; 