import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiTag } from 'react-icons/fi';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
        isAvailable: true,
    });

    useEffect(() => {
        // Simulate fetching menu items
        const fetchMenuItems = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMenuItems([
                {
                    id: '1',
                    name: 'Margherita Pizza',
                    description: 'Classic tomato sauce with mozzarella and fresh basil',
                    price: 12.99,
                    category: 'Pizza',
                    image: 'https://example.com/pizza.jpg',
                    isAvailable: true,
                },
                {
                    id: '2',
                    name: 'Chicken Burger',
                    description: 'Grilled chicken patty with lettuce, tomato, and special sauce',
                    price: 8.99,
                    category: 'Burgers',
                    image: 'https://example.com/burger.jpg',
                    isAvailable: true,
                },
            ]);
        };

        fetchMenuItems();
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                image: null,
                isAvailable: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: null,
            isAvailable: true,
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (editingItem) {
            // Update existing item
            setMenuItems(prev =>
                prev.map(item =>
                    item.id === editingItem.id
                        ? { ...item, ...formData }
                        : item
                )
            );
        } else {
            // Add new item
            const newItem = {
                id: Date.now().toString(),
                ...formData,
            };
            setMenuItems(prev => [...prev, newItem]);
        }

        handleCloseModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMenuItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const toggleAvailability = async (id) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMenuItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, isAvailable: !item.isAvailable }
                    : item
            )
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Add Item
                </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                    <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="relative h-48 bg-gray-200">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <FiImage className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => toggleAvailability(item.id)}
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${item.isAvailable
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                <span className="text-lg font-semibold text-gray-900">
                                    ${item.price}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <FiTag className="mr-1 h-4 w-4" />
                                {item.category}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FiEdit2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-400 hover:text-red-500"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
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
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="input-field mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="input-field mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        id="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="input-field mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-medium
                                            file:bg-orange-50 file:text-orange-700
                                            hover:file:bg-orange-100"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isAvailable"
                                        id="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                                        Available
                                    </label>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    {editingItem ? 'Update' : 'Add'} Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement; 