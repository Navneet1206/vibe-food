import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import {
    setUser,
    setRole,
    setLoading,
    setError,
    setOtpSent,
    setOtpVerified,
    setPhoneNumber,
} from '../../store/slices/authSlice';

const RestaurantLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setLocalError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, otpSent, otpVerified } = useSelector(state => state.auth);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!phoneNumber || phoneNumber.length !== 10) {
            setLocalError('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            dispatch(setLoading(true));
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch(setPhoneNumber(phoneNumber));
            dispatch(setOtpSent(true));
            // In a real app, you would make an API call to send OTP
        } catch (err) {
            dispatch(setError('Failed to send OTP. Please try again.'));
            setLocalError('Failed to send OTP. Please try again.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!otp || otp.length !== 6) {
            setLocalError('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            dispatch(setLoading(true));
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch(setOtpVerified(true));
            // In a real app, you would make an API call to verify OTP
            dispatch(setUser({
                id: '1',
                name: 'Restaurant Owner',
                phoneNumber,
                role: 'restaurant',
            }));
            dispatch(setRole('restaurant'));
            navigate('/restaurant/dashboard');
        } catch (err) {
            dispatch(setError('Invalid OTP. Please try again.'));
            setLocalError('Invalid OTP. Please try again.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Restaurant Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to manage your restaurant
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {!otpSent ? (
                            <div>
                                <label htmlFor="phone-number" className="sr-only">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone-number"
                                        name="phone"
                                        type="tel"
                                        required
                                        className="input-field pl-10"
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        maxLength="10"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="otp" className="sr-only">
                                    OTP
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        className="input-field pl-10"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                'Processing...'
                            ) : (
                                <>
                                    {otpSent ? 'Verify OTP' : 'Send OTP'}
                                    <FiArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestaurantLogin; 