import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8095/api/auth/login', {
                email,
                password
            });

            const data = response.data;
            setMessage(data.message);

            if (data.message.includes('successful')) {
                // Store user data for the dashboard
                localStorage.setItem('user', JSON.stringify({
                    id: data.userId,
                    role: data.role,
                    fullName: data.fullName
                }));

                // Redirect based on role
                setTimeout(() => {
                    if (data.role === 'CLIENT') {
                        navigate('/client-dashboard');
                    } else if (data.role === 'FREELANCER') {
                        navigate('/freelancer-onboarding');
                    } else {
                        navigate('/');
                    }
                }, 1500);
            }
        } catch (error) {
            setMessage('Login failed. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Great to see you again! Please log in.</p>
                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="auth-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button">Sign In</button>
                    </form>
                    {message && (
                        <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Login;
