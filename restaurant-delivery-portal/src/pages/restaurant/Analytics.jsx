import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiUsers, FiShoppingBag, FiClock } from 'react-icons/fi';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('week'); // week, month, year
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalCustomers: 0,
    });

    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [topItems, setTopItems] = useState([]);

    useEffect(() => {
        // Simulate fetching analytics data
        const fetchAnalytics = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data
            setStats({
                totalRevenue: 12500,
                totalOrders: 156,
                averageOrderValue: 80.13,
                totalCustomers: 89,
            });

            setRevenueData([
                { name: 'Mon', revenue: 1200 },
                { name: 'Tue', revenue: 1500 },
                { name: 'Wed', revenue: 1800 },
                { name: 'Thu', revenue: 1400 },
                { name: 'Fri', revenue: 2000 },
                { name: 'Sat', revenue: 2500 },
                { name: 'Sun', revenue: 2200 },
            ]);

            setCategoryData([
                { name: 'Pizza', value: 35 },
                { name: 'Burgers', value: 25 },
                { name: 'Drinks', value: 20 },
                { name: 'Sides', value: 15 },
                { name: 'Desserts', value: 5 },
            ]);

            setTopItems([
                {
                    name: 'Margherita Pizza',
                    orders: 45,
                    revenue: 583.55,
                },
                {
                    name: 'Chicken Burger',
                    orders: 38,
                    revenue: 341.62,
                },
                {
                    name: 'Coca Cola',
                    orders: 89,
                    revenue: 266.11,
                },
            ]);
        };

        fetchAnalytics();
    }, [timeRange]);

    const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="input-field"
                >
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last 12 Months</option>
                </select>
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
                                <FiTrendingUp className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Average Order Value
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        ${stats.averageOrderValue}
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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Revenue Chart */}
                <div className="bg-white shadow rounded-lg p-6">
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

                {/* Category Distribution */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Items */}
            <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Top Performing Items</h2>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {topItems.map((item, index) => (
                            <li key={index} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-sm font-medium text-orange-800">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {item.orders} orders
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            ${item.revenue}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Revenue
                                        </p>
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

export default Analytics; 