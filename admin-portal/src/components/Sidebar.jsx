import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import {
    FiHome,
    FiShoppingBag,
    FiTruck,
    FiUsers,
    FiShoppingCart,
    FiSettings,
} from 'react-icons/fi';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <FiHome />, path: '/' },
    { text: 'Restaurants', icon: <FiShoppingBag />, path: '/restaurants' },
    { text: 'Delivery Partners', icon: <FiTruck />, path: '/delivery-partners' },
    { text: 'Users', icon: <FiUsers />, path: '/users' },
    { text: 'Orders', icon: <FiShoppingCart />, path: '/orders' },
    { text: 'Settings', icon: <FiSettings />, path: '/settings' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                },
            }}
        >
            {/* Logo */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Admin Portal
                </Typography>
            </Box>
            <Divider />

            {/* Navigation Menu */}
            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar; 