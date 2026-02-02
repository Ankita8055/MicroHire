import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Auth.css';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8095/api/auth/verify-otp', {
                email,
                otp
            });
            setMessage(response.data);
            if (response.data.includes('successful')) {
                // Determine next step
                // Ideally we would auto-login here, but for security/MVP flow, we redirect to login to get the token.
                // We pass a state message to Login to show a "Verification Successful, please login" banner if we wanted.
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (error) {
            setMessage('Verification failed. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Verify Email</h2>
                    <p className="auth-subtitle">We've sent a 6-digit code to <strong>{email}</strong></p>
                    <form className="auth-form" onSubmit={handleVerify}>
                        <div className="auth-input-group">
                            <label className="auth-label">One-Time Password</label>
                            <input
                                type="text"
                                placeholder="000000"
                                className="auth-input"
                                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '20px' }}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button">Verify Code</button>
                    </form>
                    {message && (
                        <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                    <div className="auth-footer">
                        Didn't receive the code? <button className="auth-link" style={{ background: 'none', border: 'none', padding: 0 }}>Resend OTP</button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default OtpVerification;
