import { useState, useEffect } from 'react';
import axios from 'axios';

const DeliverySettings = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [settings, setSettings] = useState({
        notifications: {
            newOrders: true,
            orderUpdates: true,
            paymentReceived: true,
            systemUpdates: true,
        },
        preferences: {
            maxDistance: 10, // in kilometers
            minOrderAmount: 100,
            preferredPaymentMethod: 'cash',
            autoAcceptOrders: false,
        },
        workingHours: {
            start: '09:00',
            end: '21:00',
            workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        },
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/delivery/settings`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSettings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch settings');
            setLoading(false);
        }
    };

    const handleNotificationChange = (type) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type],
            },
        }));
    };

    const handlePreferenceChange = (type, value) => {
        setSettings((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [type]: value,
            },
        }));
    };

    const handleWorkingHoursChange = (type, value) => {
        setSettings((prev) => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [type]: value,
            },
        }));
    };

    const handleWorkingDayToggle = (day) => {
        setSettings((prev) => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                workingDays: prev.workingHours.workingDays.includes(day)
                    ? prev.workingHours.workingDays.filter((d) => d !== day)
                    : [...prev.workingHours.workingDays, day],
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_API_URL}/delivery/settings`,
                settings,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuccess('Settings updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update settings');
            setTimeout(() => setError(null), 3000);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-600">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Notifications */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                    <div className="space-y-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.notifications.newOrders}
                                onChange={() => handleNotificationChange('newOrders')}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">New Orders</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.notifications.orderUpdates}
                                onChange={() => handleNotificationChange('orderUpdates')}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Order Updates</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.notifications.paymentReceived}
                                onChange={() => handleNotificationChange('paymentReceived')}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Payment Received</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.notifications.systemUpdates}
                                onChange={() => handleNotificationChange('systemUpdates')}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">System Updates</span>
                        </label>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum Delivery Distance (km)
                            </label>
                            <input
                                type="number"
                                value={settings.preferences.maxDistance}
                                onChange={(e) => handlePreferenceChange('maxDistance', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                min="1"
                                max="50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Order Amount
                            </label>
                            <input
                                type="number"
                                value={settings.preferences.minOrderAmount}
                                onChange={(e) => handlePreferenceChange('minOrderAmount', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Payment Method
                            </label>
                            <select
                                value={settings.preferences.preferredPaymentMethod}
                                onChange={(e) => handlePreferenceChange('preferredPaymentMethod', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            >
                                <option value="cash">Cash</option>
                                <option value="online">Online</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.preferences.autoAcceptOrders}
                                    onChange={(e) => handlePreferenceChange('autoAcceptOrders', e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Auto-Accept Orders</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={settings.workingHours.start}
                                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={settings.workingHours.end}
                                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                            <label key={day} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.workingHours.workingDays.includes(day)}
                                    onChange={() => handleWorkingDayToggle(day)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeliverySettings; 