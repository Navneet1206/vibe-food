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
    FiMapPin,
    FiClock,
    FiDollarSign,
    FiStar,
} from 'react-icons/fi';
import { DataGrid } from '@mui/x-data-grid';

const DeliveryPartners = () => {
    const [loading, setLoading] = useState(true);
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Simulate fetching delivery partners data
        const fetchPartners = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setPartners([
                {
                    id: 1,
                    name: 'Alex Johnson',
                    email: 'alex@example.com',
                    phone: '+1234567890',
                    vehicleType: 'Motorcycle',
                    vehicleNumber: 'MC123',
                    status: 'active',
                    isOnline: true,
                    rating: 4.8,
                    totalDeliveries: 245,
                    totalEarnings: 3500,
                    currentLocation: 'Downtown',
                    lastActive: '2 minutes ago',
                    verificationStatus: 'verified',
                    registrationDate: '2024-01-15',
                },
                {
                    id: 2,
                    name: 'Sarah Wilson',
                    email: 'sarah@example.com',
                    phone: '+1234567891',
                    vehicleType: 'Bicycle',
                    vehicleNumber: 'BC456',
                    status: 'pending',
                    isOnline: false,
                    rating: 0,
                    totalDeliveries: 0,
                    totalEarnings: 0,
                    currentLocation: 'N/A',
                    lastActive: 'Never',
                    verificationStatus: 'pending',
                    registrationDate: '2024-01-18',
                },
                {
                    id: 3,
                    name: 'Mike Brown',
                    email: 'mike@example.com',
                    phone: '+1234567892',
                    vehicleType: 'Car',
                    vehicleNumber: 'CAR789',
                    status: 'active',
                    isOnline: true,
                    rating: 4.5,
                    totalDeliveries: 189,
                    totalEarnings: 2800,
                    currentLocation: 'Uptown',
                    lastActive: '5 minutes ago',
                    verificationStatus: 'verified',
                    registrationDate: '2024-01-10',
                },
            ]);

            setLoading(false);
        };

        fetchPartners();
    }, []);

    const handleStatusChange = async (partnerId, newStatus) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setPartners(prev =>
            prev.map(partner =>
                partner.id === partnerId
                    ? { ...partner, status: newStatus }
                    : partner
            )
        );
    };

    const handleViewDetails = (partner) => {
        setSelectedPartner(partner);
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

    const getVerificationColor = (status) => {
        switch (status) {
            case 'verified':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const filteredPartners = partners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.phone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || partner.status === filter;

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
        { field: 'vehicleType', headerName: 'Vehicle', width: 120 },
        { field: 'vehicleNumber', headerName: 'Vehicle No.', width: 120 },
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
            field: 'verificationStatus',
            headerName: 'Verification',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getVerificationColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'isOnline',
            headerName: 'Online',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Yes' : 'No'}
                    color={params.value ? 'success' : 'default'}
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
            field: 'totalDeliveries',
            headerName: 'Deliveries',
            width: 100,
        },
        {
            field: 'totalEarnings',
            headerName: 'Earnings',
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
                    Delivery Partners
                </Typography>
                <Button variant="contained" color="primary">
                    Add New Partner
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
                                placeholder="Search partners..."
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

            {/* Partners Table */}
            <Card>
                <CardContent>
                    <DataGrid
                        rows={filteredPartners}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        autoHeight
                    />
                </CardContent>
            </Card>

            {/* Partner Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedPartner && (
                    <>
                        <DialogTitle>Partner Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={selectedPartner.name}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={selectedPartner.email}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={selectedPartner.phone}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Vehicle Type"
                                        value={selectedPartner.vehicleType}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Vehicle Number"
                                        value={selectedPartner.vehicleNumber}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Current Location"
                                        value={selectedPartner.currentLocation}
                                        disabled
                                        InputProps={{
                                            startAdornment: <FiMapPin style={{ marginRight: 8, color: '#64748b' }} />,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Active"
                                        value={selectedPartner.lastActive}
                                        disabled
                                        InputProps={{
                                            startAdornment: <FiClock style={{ marginRight: 8, color: '#64748b' }} />,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total Deliveries"
                                        value={selectedPartner.totalDeliveries}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total Earnings"
                                        value={`$${selectedPartner.totalEarnings.toLocaleString()}`}
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
                                        value={selectedPartner.rating ? `${selectedPartner.rating} ⭐` : 'N/A'}
                                        disabled
                                        InputProps={{
                                            startAdornment: <FiStar style={{ marginRight: 8, color: '#64748b' }} />,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Registration Date"
                                        value={new Date(selectedPartner.registrationDate).toLocaleDateString()}
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

export default DeliveryPartners; 