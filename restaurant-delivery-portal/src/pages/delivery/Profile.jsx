import { useState, useEffect } from 'react';
import { FiUser, FiMapPin, FiPhone, FiMail, FiDollarSign, FiCalendar, FiClock, FiNavigation } from 'react-icons/fi';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        vehicleType: '',
        vehicleNumber: '',
        profileImage: null,
    });

    const [earnings, setEarnings] = useState({
        totalEarnings: 0,
        todayEarnings: 0,
        weeklyEarnings: 0,
        monthlyEarnings: 0,
    });

    const [deliveryStats, setDeliveryStats] = useState({
        totalDeliveries: 0,
        averageRating: 0,
        completionRate: 0,
    });

    const [earningsData, setEarningsData] = useState([]);

    useEffect(() => {
        // Simulate fetching profile data
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setProfileData({
                name: 'John Doe',
                phone: '+1234567890',
                email: 'john.doe@example.com',
                address: '123 Main St, City',
                vehicleType: 'Motorcycle',
                vehicleNumber: 'ABC123',
                profileImage: 'https://example.com/profile.jpg',
            });

            setEarnings({
                totalEarnings: 12500,
                todayEarnings: 150,
                weeklyEarnings: 850,
                monthlyEarnings: 3500,
            });

            setDeliveryStats({
                totalDeliveries: 156,
                averageRating: 4.8,
                completionRate: 98,
            });

            setEarningsData([
                { date: 'Mon', earnings: 120 },
                { date: 'Tue', earnings: 150 },
                { date: 'Wed', earnings: 180 },
                { date: 'Thu', earnings: 140 },
                { date: 'Fri', earnings: 200 },
                { date: 'Sat', earnings: 250 },
                { date: 'Sun', earnings: 220 },
            ]);
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData(prev => ({
                ...prev,
                profileImage: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Profile updated successfully!');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Profile Information */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                                {/* Profile Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Profile Image
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden">
                                            {profileData.profileImage ? (
                                                <img
                                                    src={profileData.profileImage}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <FiUser className="h-full w-full text-gray-400" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="ml-4 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-medium
                                                file:bg-orange-50 file:text-orange-700
                                                hover:file:bg-orange-100"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiUser className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={profileData.name}
                                                onChange={handleInputChange}
                                                className="input-field pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiPhone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                className="input-field pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="input-field pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="address"
                                                id="address"
                                                value={profileData.address}
                                                onChange={handleInputChange}
                                                className="input-field pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                                            Vehicle Type
                                        </label>
                                        <select
                                            name="vehicleType"
                                            id="vehicleType"
                                            value={profileData.vehicleType}
                                            onChange={handleInputChange}
                                            className="input-field mt-1"
                                            required
                                        >
                                            <option value="">Select Vehicle Type</option>
                                            <option value="Motorcycle">Motorcycle</option>
                                            <option value="Bicycle">Bicycle</option>
                                            <option value="Car">Car</option>
                                            <option value="Scooter">Scooter</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                                            Vehicle Number
                                        </label>
                                        <input
                                            type="text"
                                            name="vehicleNumber"
                                            id="vehicleNumber"
                                            value={profileData.vehicleNumber}
                                            onChange={handleInputChange}
                                            className="input-field mt-1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="btn-primary w-full"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Earnings and Stats */}
                <div className="space-y-8">
                    {/* Earnings Overview */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Earnings Overview</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                                    <span className="ml-2 text-sm font-medium text-gray-500">Total Earnings</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">
                                    ${earnings.totalEarnings}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiCalendar className="h-5 w-5 text-gray-400" />
                                    <span className="ml-2 text-sm font-medium text-gray-500">Today</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">
                                    ${earnings.todayEarnings}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiClock className="h-5 w-5 text-gray-400" />
                                    <span className="ml-2 text-sm font-medium text-gray-500">This Week</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">
                                    ${earnings.weeklyEarnings}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiNavigation className="h-5 w-5 text-gray-400" />
                                    <span className="ml-2 text-sm font-medium text-gray-500">This Month</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">
                                    ${earnings.monthlyEarnings}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Stats */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Stats</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Total Deliveries</span>
                                <span className="text-lg font-semibold text-gray-900">
                                    {deliveryStats.totalDeliveries}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Average Rating</span>
                                <span className="text-lg font-semibold text-gray-900">
                                    {deliveryStats.averageRating} ⭐
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Completion Rate</span>
                                <span className="text-lg font-semibold text-gray-900">
                                    {deliveryStats.completionRate}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Earnings Chart */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Earnings</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={earningsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 