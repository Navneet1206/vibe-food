import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        cuisine: '',
        description: '',
        isActive: true,
        isVerified: false,
    });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/vendors`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setVendors(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch vendors');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (selectedVendor) {
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/admin/vendors/${selectedVendor._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/admin/vendors`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }
            setShowVendorModal(false);
            setSelectedVendor(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                cuisine: '',
                description: '',
                isActive: true,
                isVerified: false,
            });
            fetchVendors();
        } catch (err) {
            setError('Failed to save vendor');
        }
    };

    const handleEdit = (vendor) => {
        setSelectedVendor(vendor);
        setFormData({
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
            cuisine: vendor.cuisine,
            description: vendor.description,
            isActive: vendor.isActive,
            isVerified: vendor.isVerified,
        });
        setShowVendorModal(true);
    };

    const handleDelete = async (vendorId) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/admin/vendors/${vendorId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                fetchVendors();
            } catch (err) {
                setError('Failed to delete vendor');
            }
        }
    };

    const filteredVendors = vendors.filter((vendor) => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus ||
            (selectedStatus === 'active' && vendor.isActive) ||
            (selectedStatus === 'inactive' && !vendor.isActive);
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                <button
                    onClick={() => setShowVendorModal(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Add New Vendor
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                    <div
                        key={vendor._id}
                        className="bg-white rounded-lg shadow-soft overflow-hidden"
                    >
                        <div className="relative h-48">
                            <img
                                src={vendor.image || 'https://via.placeholder.com/400x200'}
                                alt={vendor.name}
                                className="w-full h-full object-cover"
                            />
                            {vendor.isVerified && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                                    Verified
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {vendor.name}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4">
                                {vendor.description}
                            </p>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {vendor.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    {vendor.phone}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {vendor.address}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {vendor.cuisine}
                                </span>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${vendor.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {vendor.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(vendor)}
                                    className="px-3 py-1 text-sm text-primary hover:text-primary-dark"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(vendor._id)}
                                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Vendor Modal */}
            {showVendorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedVendor ? 'Edit Vendor' : 'Add New Vendor'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Restaurant Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cuisine Type
                                </label>
                                <input
                                    type="text"
                                    value={formData.cuisine}
                                    onChange={(e) =>
                                        setFormData({ ...formData, cuisine: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVerified}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isVerified: e.target.checked })
                                        }
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Verified</span>
                                </label>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowVendorModal(false);
                                        setSelectedVendor(null);
                                        setFormData({
                                            name: '',
                                            email: '',
                                            phone: '',
                                            address: '',
                                            cuisine: '',
                                            description: '',
                                            isActive: true,
                                            isVerified: false,
                                        });
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                >
                                    {selectedVendor ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendors; 