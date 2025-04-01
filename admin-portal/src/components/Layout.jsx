import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { FiBell, FiSettings, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Layout = ({ children }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            {children}

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Bar */}
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Admin Portal
                        </Typography>

                        {/* Notifications */}
                        <IconButton color="inherit">
                            <FiBell />
                        </IconButton>

                        {/* User Menu */}
                        <IconButton
                            onClick={handleMenu}
                            size="small"
                            sx={{ ml: 2 }}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>
                                {user?.name?.charAt(0) || 'A'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            onClick={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <FiSettings className="mr-2" />
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <FiLogOut className="mr-2" />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: 'background.default',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default Layout; 