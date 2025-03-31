import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Home = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button className="btn btn-primary w-full">View Orders</button>
                                <button className="btn btn-primary w-full">Update Profile</button>
                                <button className="btn btn-primary w-full">Contact Support</button>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-green-50 p-6 rounded-lg">
                            <h2 className="text-lg font-semibold text-green-900 mb-4">Recent Orders</h2>
                            <p className="text-gray-600">No recent orders found.</p>
                        </div>

                        {/* Account Summary */}
                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h2 className="text-lg font-semibold text-purple-900 mb-4">Account Summary</h2>
                            <div className="space-y-2">
                                <p className="text-gray-600">Email: {user?.email}</p>
                                <p className="text-gray-600">Phone: {user?.phone}</p>
                                <p className="text-gray-600">Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 