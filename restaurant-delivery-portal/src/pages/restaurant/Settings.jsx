import { useState, useEffect } from 'react';
import { FiSave, FiUpload, FiMapPin, FiPhone, FiMail, FiClock, FiDollarSign } from 'react-icons/fi';

const Settings = () => {
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        openingHours: {
            monday: { open: '09:00', close: '22:00' },
            tuesday: { open: '09:00', close: '22:00' },
            wednesday: { open: '09:00', close: '22:00' },
            thursday: { open: '09:00', close: '22:00' },
            friday: { open: '09:00', close: '23:00' },
            saturday: { open: '10:00', close: '23:00' },
            sunday: { open: '10:00', close: '22:00' },
        },
        deliveryFee: 0,
        minimumOrder: 0,
        isOpen: true,
        logo: null,
        coverImage: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Simulate fetching restaurant data
        const fetchRestaurantData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRestaurantData({
                name: 'Pizza Place',
                description: 'Best pizza in town with fresh ingredients',
                address: '123 Main St, City',
                phone: '+1234567890',
                email: 'contact@pizzaplace.com',
                openingHours: {
                    monday: { open: '09:00', close: '22:00' },
                    tuesday: { open: '09:00', close: '22:00' },
                    wednesday: { open: '09:00', close: '22:00' },
                    thursday: { open: '09:00', close: '22:00' },
                    friday: { open: '09:00', close: '23:00' },
                    saturday: { open: '10:00', close: '23:00' },
                    sunday: { open: '10:00', close: '22:00' },
                },
                deliveryFee: 2.99,
                minimumOrder: 15.00,
                isOpen: true,
                logo: 'https://example.com/logo.jpg',
                coverImage: 'https://example.com/cover.jpg',
            });
            setIsLoading(false);
        };

        fetchRestaurantData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setRestaurantData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setRestaurantData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setRestaurantData(prev => ({
                ...prev,
                [type]: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Settings updated successfully!');
        } catch (error) {
            setErrorMessage('Failed to update settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Restaurant Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Restaurant Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={restaurantData.name}
                                onChange={handleInputChange}
                                className="input-field mt-1"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows={3}
                                value={restaurantData.description}
                                onChange={handleInputChange}
                                className="input-field mt-1"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                    value={restaurantData.address}
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
                                    value={restaurantData.phone}
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
                                    value={restaurantData.email}
                                    onChange={handleInputChange}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Opening Hours */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Opening Hours</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(restaurantData.openingHours).map(([day, hours]) => (
                            <div key={day} className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-gray-700 capitalize">
                                    {day}
                                </label>
                                <div className="flex-1 flex space-x-2">
                                    <input
                                        type="time"
                                        name={`openingHours.${day}.open`}
                                        value={hours.open}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                    <span className="flex items-center">to</span>
                                    <input
                                        type="time"
                                        name={`openingHours.${day}.close`}
                                        value={hours.close}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Settings */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Settings</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700">
                                Delivery Fee
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="deliveryFee"
                                    id="deliveryFee"
                                    step="0.01"
                                    value={restaurantData.deliveryFee}
                                    onChange={handleInputChange}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700">
                                Minimum Order Amount
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="minimumOrder"
                                    id="minimumOrder"
                                    step="0.01"
                                    value={restaurantData.minimumOrder}
                                    onChange={handleInputChange}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Restaurant Logo
                            </label>
                            <div className="mt-1 flex items-center">
                                <input
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'logo')}
                                    className="hidden"
                                    id="logo"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="logo"
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-orange-50 file:text-orange-700
                                        hover:file:bg-orange-100"
                                >
                                    <FiUpload className="inline-block mr-2 h-5 w-5" />
                                    Upload Logo
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Cover Image
                            </label>
                            <div className="mt-1 flex items-center">
                                <input
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'coverImage')}
                                    className="hidden"
                                    id="coverImage"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="coverImage"
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-orange-50 file:text-orange-700
                                        hover:file:bg-orange-100"
                                >
                                    <FiUpload className="inline-block mr-2 h-5 w-5" />
                                    Upload Cover Image
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Restaurant Status</h2>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isOpen"
                            id="isOpen"
                            checked={restaurantData.isOpen}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-700">
                            Restaurant is Open
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                    >
                        {isLoading ? (
                            'Saving...'
                        ) : (
                            <>
                                <FiSave className="mr-2 h-5 w-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiCheck className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    {successMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiX className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Settings; 