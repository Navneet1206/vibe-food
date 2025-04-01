import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';

// Restaurant Components
import RestaurantLogin from './pages/restaurant/Login';
import RestaurantDashboard from './pages/restaurant/Dashboard';
import MenuManagement from './pages/restaurant/MenuManagement';
import Orders from './pages/restaurant/Orders';
import Analytics from './pages/restaurant/Analytics';
import Settings from './pages/restaurant/Settings';

// Delivery Partner Components
import DeliveryLogin from './pages/delivery/Login';
import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryOrders from './pages/delivery/Orders';
import DeliveryProfile from './pages/delivery/Profile';

const App = () => {
    const { user, role } = useSelector(state => state.auth);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {user && <Navbar />}
                <main className="pt-16">
                    <Routes>
                        {/* Restaurant Routes */}
                        <Route path="/restaurant/login" element={<RestaurantLogin />} />
                        <Route
                            path="/restaurant/*"
                            element={
                                user && role === 'restaurant' ? (
                                    <Routes>
                                        <Route path="dashboard" element={<RestaurantDashboard />} />
                                        <Route path="menu" element={<MenuManagement />} />
                                        <Route path="orders" element={<Orders />} />
                                        <Route path="analytics" element={<Analytics />} />
                                        <Route path="settings" element={<Settings />} />
                                    </Routes>
                                ) : (
                                    <Navigate to="/restaurant/login" replace />
                                )
                            }
                        />

                        {/* Delivery Partner Routes */}
                        <Route path="/delivery/login" element={<DeliveryLogin />} />
                        <Route
                            path="/delivery/*"
                            element={
                                user && role === 'delivery' ? (
                                    <Routes>
                                        <Route path="dashboard" element={<DeliveryDashboard />} />
                                        <Route path="orders" element={<DeliveryOrders />} />
                                        <Route path="profile" element={<DeliveryProfile />} />
                                    </Routes>
                                ) : (
                                    <Navigate to="/delivery/login" replace />
                                )
                            }
                        />

                        {/* Default Route */}
                        <Route path="/" element={<Navigate to="/restaurant/login" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App; 