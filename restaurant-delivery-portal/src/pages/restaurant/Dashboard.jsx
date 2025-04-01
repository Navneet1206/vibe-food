import { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiUsers } from 'react-icons/fi';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeOrders: 0,
        totalCustomers: 0,
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            // Simulate API calls
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data
            setStats({
                totalOrders: 156,
                totalRevenue: 12500,
                activeOrders: 8,
                totalCustomers: 89,
            });

            setRecentOrders([
                {
                    id: '1',
                    customerName: 'John Doe',
                    items: 3,
                    total: 45.99,
                    status: 'preparing',
                    time: '10:30 AM',
                },
                {
                    id: '2',
                    customerName: 'Jane Smith',
                    items: 2,
                    total: 32.50,
                    status: 'ready',
                    time: '10:25 AM',
                },
                {
                    id: '3',
                    customerName: 'Mike Johnson',
                    items: 4,
                    total: 68.75,
                    status: 'delivered',
                    time: '10:15 AM',
                },
            ]);

            setRevenueData([
                { name: 'Mon', revenue: 1200 },
                { name: 'Tue', revenue: 1500 },
                { name: 'Wed', revenue: 1800 },
                { name: 'Thu', revenue: 1400 },
                { name: 'Fri', revenue: 2000 },
                { name: 'Sat', revenue: 2500 },
                { name: 'Sun', revenue: 2200 },
            ]);
        };

        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800';
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'delivered':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Orders
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        {stats.totalOrders}
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
                                <FiDollarSign className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Revenue
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        ${stats.totalRevenue}
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
                                <FiTrendingUp className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Active Orders
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        {stats.activeOrders}
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
                                <FiUsers className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Customers
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        {stats.totalCustomers}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#f97316"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                            <li key={order.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {order.customerName.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {order.customerName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {order.items} items • ${order.total}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-sm text-gray-500">{order.time}</span>
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