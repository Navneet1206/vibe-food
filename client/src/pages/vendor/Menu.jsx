import { useState, useEffect } from 'react';
import axios from 'axios';

const VendorMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        isVeg: false,
    });

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/vendor/menu`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMenuItems(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch menu items');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingItem) {
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/vendor/menu/${editingItem._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/vendor/menu`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }
            setShowAddModal(false);
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                image: '',
                isVeg: false,
            });
            fetchMenuItems();
        } catch (err) {
            setError('Failed to save menu item');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            isVeg: item.isVeg,
        });
        setShowAddModal(true);
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/vendor/menu/${itemId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                fetchMenuItems();
            } catch (err) {
                setError('Failed to delete menu item');
            }
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Add New Item
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-lg shadow-soft overflow-hidden"
                    >
                        <div className="relative h-48">
                            <img
                                src={item.image || 'https://via.placeholder.com/400x200'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            {item.isVeg && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                                    Veg
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {item.name}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4">
                                {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-primary font-semibold">
                                    ₹{item.price}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {item.category}
                                </span>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="px-3 py-1 text-sm text-primary hover:text-primary-dark"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
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
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({ ...formData, image: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVeg}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isVeg: e.target.checked })
                                        }
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Vegetarian
                                    </span>
                                </label>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingItem(null);
                                        setFormData({
                                            name: '',
                                            description: '',
                                            price: '',
                                            category: '',
                                            image: '',
                                            isVeg: false,
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
                                    {editingItem ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorMenu; 