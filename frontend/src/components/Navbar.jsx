import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [localStorage.getItem('user')]); // Rerender when storage changes

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        Freelancer<span className="logo-accent">Connect</span>
                    </Link>
                </div>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link
                                to={user.role === 'CLIENT' ? "/client-dashboard" : "/"}
                                className="nav-link"
                            >
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="nav-button logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/about" className="nav-link">About Us</Link>
                            <Link to="/signup" className="nav-button">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
