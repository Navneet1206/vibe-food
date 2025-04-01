import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    MenuItem,
    Avatar,
    Tooltip,
} from '@mui/material';
import {
    FiCheck,
    FiX,
    FiEdit2,
    FiEye,
    FiSearch,
    FiShoppingBag,
    FiDollarSign,
    FiStar,
    FiMapPin,
} from 'react-icons/fi';
import { DataGrid } from '@mui/x-data-grid';

const Users = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Simulate fetching users data
        const fetchUsers = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUsers([
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+1234567890',
                    status: 'active',
                    totalOrders: 15,
                    totalSpent: 450,
                    favoriteRestaurants: ['Pizza Place', 'Burger Joint'],
                    lastOrder: '2024-01-20',
                    registrationDate: '2023-12-15',
                    address: '123 Main St, City',
                    rating: 4.5,
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '+1234567891',
                    status: 'active',
                    totalOrders: 8,
                    totalSpent: 280,
                    favoriteRestaurants: ['Sushi Bar'],
                    lastOrder: '2024-01-18',
                    registrationDate: '2024-01-05',
                    address: '456 Oak Ave, City',
                    rating: 4.8,
                },
                {
                    id: 3,
                    name: 'Mike Johnson',
                    email: 'mike@example.com',
                    phone: '+1234567892',
                    status: 'inactive',
                    totalOrders: 3,
                    totalSpent: 120,
                    favoriteRestaurants: [],
                    lastOrder: '2023-12-30',
                    registrationDate: '2023-11-20',
                    address: '789 Pine St, City',
                    rating: 4.2,
                },
            ]);

            setLoading(false);
        };

        fetchUsers();
    }, []);

    const handleStatusChange = async (userId, newStatus) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: newStatus }
                    : user
            )
        );
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'error';
            case 'suspended':
                return 'warning';
            default:
                return 'default';
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || user.status === filter;

        return matchesSearch && matchesFilter;
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {params.value.charAt(0)}
                    </Avatar>
                    {params.value}
                </Box>
            ),
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getStatusColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'totalOrders',
            headerName: 'Orders',
            width: 100,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiShoppingBag style={{ color: '#64748b' }} />
                    {params.value}
                </Box>
            ),
        },
        {
            field: 'totalSpent',
            headerName: 'Total Spent',
            width: 130,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiDollarSign style={{ color: '#64748b' }} />
                    {params.value.toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 100,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiStar style={{ color: '#64748b' }} />
                    {params.value}
                </Box>
            ),
        },
        {
            field: 'lastOrder',
            headerName: 'Last Order',
            width: 130,
            renderCell: (params) => (
                new Date(params.value).toLocaleDateString()
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => handleViewDetails(params.row)}
                        color="primary"
                    >
                        <FiEye />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleStatusChange(params.row.id, params.row.status === 'active' ? 'suspended' : 'active')}
                        color={params.row.status === 'active' ? 'error' : 'success'}
                    >
                        {params.row.status === 'active' ? <FiX /> : <FiCheck />}
                    </IconButton>
                </Box>
            ),
        },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Users
                </Typography>
                <Button variant="contained" color="primary">
                    Add New User
                </Button>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <FiSearch style={{ marginRight: 8, color: '#64748b' }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                                <MenuItem value="suspended">Suspended</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent>
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        autoHeight
                    />
                </CardContent>
            </Card>

            {/* User Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedUser && (
                    <>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={selectedUser.name}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={selectedUser.email}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={selectedUser.phone}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        value={selectedUser.address}
                                        disabled
                                        InputProps={{
                                            startAdornment: <FiMapPin style={{ marginRight: 8, color: '#64748b' }} />,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total Orders"
                                        value={selectedUser.totalOrders}
                                        disabled
                                        InputProps={{
                                            startAdornment: <FiShoppingBag style={{ marginRight: 8, color: '#64748b' }} />,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total Spent"
                                        value={`$${selectedUser.totalSpent.toLocaleString()}`}
                                        disabled
                                        InputProps={{
                                            startAdornment: <FiDollarSign style={{ marginRight: 8, color: '#64748b' }} />,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Rating"
                                        value={selectedUser.rating ? `${selectedUser.rating} ⭐` : 'N/A'}
                                        disabled
                                        InputProps={{
                                            startAdornment: <FiStar style={{ marginRight: 8, color: '#64748b' }} />,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Order"
                                        value={new Date(selectedUser.lastOrder).toLocaleDateString()}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Registration Date"
                                        value={new Date(selectedUser.registrationDate).toLocaleDateString()}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Favorite Restaurants"
                                        value={selectedUser.favoriteRestaurants.join(', ')}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenDialog(false)}
                            >
                                Edit Details
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Users; 