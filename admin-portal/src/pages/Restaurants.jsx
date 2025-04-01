import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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
} from '@mui/material';
import {
    FiCheck,
    FiX,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiSearch,
} from 'react-icons/fi';
import { DataGrid } from '@mui/x-data-grid';

const Restaurants = () => {
    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Simulate fetching restaurants data
        const fetchRestaurants = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setRestaurants([
                {
                    id: 1,
                    name: 'Pizza Place',
                    owner: 'John Smith',
                    email: 'john@pizzaplace.com',
                    phone: '+1234567890',
                    address: '123 Main St, City',
                    status: 'active',
                    rating: 4.5,
                    totalOrders: 156,
                    totalRevenue: 12500,
                    cuisine: 'Italian',
                    registrationDate: '2024-01-15',
                },
                {
                    id: 2,
                    name: 'Burger Joint',
                    owner: 'Jane Doe',
                    email: 'jane@burgerjoint.com',
                    phone: '+1234567891',
                    address: '456 Oak Ave, City',
                    status: 'pending',
                    rating: 0,
                    totalOrders: 0,
                    totalRevenue: 0,
                    cuisine: 'American',
                    registrationDate: '2024-01-18',
                },
                {
                    id: 3,
                    name: 'Sushi Bar',
                    owner: 'Mike Johnson',
                    email: 'mike@sushibar.com',
                    phone: '+1234567892',
                    address: '789 Pine St, City',
                    status: 'active',
                    rating: 4.8,
                    totalOrders: 89,
                    totalRevenue: 8500,
                    cuisine: 'Japanese',
                    registrationDate: '2024-01-10',
                },
            ]);

            setLoading(false);
        };

        fetchRestaurants();
    }, []);

    const handleStatusChange = async (restaurantId, newStatus) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setRestaurants(prev =>
            prev.map(restaurant =>
                restaurant.id === restaurantId
                    ? { ...restaurant, status: newStatus }
                    : restaurant
            )
        );
    };

    const handleViewDetails = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setOpenDialog(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'pending':
                return 'warning';
            case 'suspended':
                return 'error';
            default:
                return 'default';
        }
    };

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || restaurant.status === filter;

        return matchesSearch && matchesFilter;
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'owner', headerName: 'Owner', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'cuisine', headerName: 'Cuisine', width: 130 },
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
            field: 'rating',
            headerName: 'Rating',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value ? `${params.value} ⭐` : 'N/A'}
                </Typography>
            ),
        },
        {
            field: 'totalOrders',
            headerName: 'Orders',
            width: 100,
        },
        {
            field: 'totalRevenue',
            headerName: 'Revenue',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2">
                    ${params.value.toLocaleString()}
                </Typography>
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
                    {params.row.status === 'pending' && (
                        <>
                            <IconButton
                                size="small"
                                onClick={() => handleStatusChange(params.row.id, 'active')}
                                color="success"
                            >
                                <FiCheck />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => handleStatusChange(params.row.id, 'suspended')}
                                color="error"
                            >
                                <FiX />
                            </IconButton>
                        </>
                    )}
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
                    Restaurants
                </Typography>
                <Button variant="contained" color="primary">
                    Add New Restaurant
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
                                placeholder="Search restaurants..."
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
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="suspended">Suspended</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Restaurants Table */}
            <Card>
                <CardContent>
                    <DataGrid
                        rows={filteredRestaurants}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        autoHeight
                    />
                </CardContent>
            </Card>

            {/* Restaurant Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedRestaurant && (
                    <>
                        <DialogTitle>Restaurant Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Restaurant Name"
                                        value={selectedRestaurant.name}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Owner Name"
                                        value={selectedRestaurant.owner}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={selectedRestaurant.email}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={selectedRestaurant.phone}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        value={selectedRestaurant.address}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Cuisine"
                                        value={selectedRestaurant.cuisine}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Registration Date"
                                        value={new Date(selectedRestaurant.registrationDate).toLocaleDateString()}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total Orders"
                                        value={selectedRestaurant.totalOrders}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total Revenue"
                                        value={`$${selectedRestaurant.totalRevenue.toLocaleString()}`}
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

export default Restaurants; 