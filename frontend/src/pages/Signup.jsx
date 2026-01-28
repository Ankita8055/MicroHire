import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        mobileNo: '',
        role: 'CLIENT'
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8095/api/auth/signup', formData);
            setMessage(response.data);
            if (response.data.includes('successfully')) {
                // Redirect to OTP verification page
                setTimeout(() => navigate('/verify-otp', { state: { email: formData.email, role: formData.role } }), 2000);
            }
        } catch (error) {
            setMessage('Signup failed. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join our community of professionals today.</p>
                    <form className="auth-form" onSubmit={handleSignup}>
                        <div className="auth-input-group">
                            <label className="auth-label">Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Full Name"
                                className="auth-input"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="auth-input"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="auth-input"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Mobile Number</label>
                            <input
                                name="mobileNo"
                                type="text"
                                placeholder="Mobile Number"
                                className="auth-input"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">I want to join as a:</label>
                            <div className="role-selection">
                                <label className="role-option">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="CLIENT"
                                        checked={formData.role === 'CLIENT'}
                                        onChange={handleChange}
                                    />
                                    Client
                                </label>
                                <label className="role-option">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="FREELANCER"
                                        checked={formData.role === 'FREELANCER'}
                                        onChange={handleChange}
                                    />
                                    Freelancer
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="auth-button">Create Account</button>
                    </form>
                    {message && (
                        <div className={`auth-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                    <div className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Login</Link>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Signup;
