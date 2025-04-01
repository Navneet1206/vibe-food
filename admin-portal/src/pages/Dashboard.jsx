import { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from '@mui/material';
import {
    FiUsers,
    FiShoppingBag,
    FiTruck,
    FiDollarSign,
    FiTrendingUp,
    FiTrendingDown,
} from 'react-icons/fi';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        totalDeliveryPartners: 0,
        totalRevenue: 0,
        revenueGrowth: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);

    useEffect(() => {
        // Simulate fetching dashboard data
        const fetchDashboardData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setStats({
                totalUsers: 1250,
                totalRestaurants: 85,
                totalDeliveryPartners: 120,
                totalRevenue: 45600,
                revenueGrowth: 12.5,
            });

            setRecentOrders([
                {
                    id: '1',
                    customer: 'John Doe',
                    restaurant: 'Pizza Place',
                    amount: 25.99,
                    status: 'Delivered',
                    date: '2024-01-20T10:30:00',
                },
                {
                    id: '2',
                    customer: 'Jane Smith',
                    restaurant: 'Burger Joint',
                    amount: 18.99,
                    status: 'In Progress',
                    date: '2024-01-20T10:25:00',
                },
                {
                    id: '3',
                    customer: 'Mike Johnson',
                    restaurant: 'Sushi Bar',
                    amount: 45.99,
                    status: 'Pending',
                    date: '2024-01-20T10:20:00',
                },
            ]);

            setRevenueData([
                { date: 'Mon', revenue: 1200 },
                { date: 'Tue', revenue: 1500 },
                { date: 'Wed', revenue: 1800 },
                { date: 'Thu', revenue: 1400 },
                { date: 'Fri', revenue: 2000 },
                { date: 'Sat', revenue: 2500 },
                { date: 'Sun', revenue: 2200 },
            ]);

            setOrderStatusData([
                { name: 'Delivered', value: 65 },
                { name: 'In Progress', value: 20 },
                { name: 'Pending', value: 15 },
            ]);

            setLoading(false);
        };

        fetchDashboardData();
    }, []);

    const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FiUsers className="text-blue-500" size={24} />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Total Users
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div">
                                {stats.totalUsers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FiShoppingBag className="text-green-500" size={24} />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Restaurants
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div">
                                {stats.totalRestaurants}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FiTruck className="text-orange-500" size={24} />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Delivery Partners
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div">
                                {stats.totalDeliveryPartners}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FiDollarSign className="text-purple-500" size={24} />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Total Revenue
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div">
                                ${stats.totalRevenue}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                {stats.revenueGrowth >= 0 ? (
                                    <FiTrendingUp className="text-green-500" />
                                ) : (
                                    <FiTrendingDown className="text-red-500" />
                                )}
                                <Typography
                                    variant="body2"
                                    color={stats.revenueGrowth >= 0 ? 'success.main' : 'error.main'}
                                    sx={{ ml: 0.5 }}
                                >
                                    {Math.abs(stats.revenueGrowth)}%
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Revenue Overview
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Order Status Distribution
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={orderStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {orderStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Orders */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Recent Orders
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Restaurant</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>{order.restaurant}</TableCell>
                                        <TableCell align="right">${order.amount}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                color={
                                                    order.status === 'Delivered'
                                                        ? 'success.main'
                                                        : order.status === 'In Progress'
                                                            ? 'warning.main'
                                                            : 'error.main'
                                                }
                                            >
                                                {order.status}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.date).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Dashboard; 