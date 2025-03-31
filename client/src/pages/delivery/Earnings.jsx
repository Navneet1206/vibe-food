import { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryEarnings = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [earnings, setEarnings] = useState({
        totalEarnings: 0,
        todayEarnings: 0,
        weeklyEarnings: 0,
        monthlyEarnings: 0,
        paymentHistory: [],
    });
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    useEffect(() => {
        fetchEarnings();
    }, [selectedPeriod]);

    const fetchEarnings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/delivery/earnings?period=${selectedPeriod}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEarnings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch earnings data');
            setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Earnings</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        ₹{earnings.totalEarnings.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-sm font-medium text-gray-500">Today's Earnings</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        ₹{earnings.todayEarnings.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-sm font-medium text-gray-500">Weekly Earnings</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        ₹{earnings.weeklyEarnings.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-sm font-medium text-gray-500">Monthly Earnings</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        ₹{earnings.monthlyEarnings.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow-soft p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {earnings.paymentHistory.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(payment.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {payment.orderId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{payment.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeliveryEarnings; 