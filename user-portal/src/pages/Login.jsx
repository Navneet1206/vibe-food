import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPhone, FiLock } from 'react-icons/fi';
import {
    setPhoneNumber,
    setOtpSent,
    setOtpVerified,
    setUser,
} from '../store/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { otpSent, loading } = useSelector(state => state.auth);
    const [phoneNumber, setPhoneNumberValue] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!phoneNumber || phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            // Here you would typically make an API call to send OTP
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch(setPhoneNumber(phoneNumber));
            dispatch(setOtpSent(true));
        } catch (error) {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            // Here you would typically make an API call to verify OTP
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful verification
            dispatch(setOtpVerified(true));
            dispatch(setUser({
                id: '1',
                phoneNumber,
                name: 'User Name', // This would come from the backend
            }));

            navigate('/');
        } catch (error) {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {otpSent ? 'Verify OTP' : 'Login to your account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {otpSent
                            ? 'Enter the 6-digit code sent to your phone'
                            : 'Enter your phone number to continue'}
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
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumberValue(e.target.value)}
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
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Enter 6-digit OTP"
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
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {loading ? (
                                'Processing...'
                            ) : otpSent ? (
                                'Verify OTP'
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login; 