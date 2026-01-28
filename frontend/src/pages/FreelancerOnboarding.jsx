import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Auth.css'; // Reusing Auth styles for consistency

const FreelancerOnboarding = () => {
    const [formData, setFormData] = useState({
        portfolioLink: '',
        primarySkill: '',
        bio: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation (can be improved)
        if (!formData.portfolioLink || !formData.primarySkill || !formData.bio) {
            setMessage('Please fill in all fields to complete your profile.');
            return;
        }

        // Simulating Backend Update
        // In a real app, this would be a PUT request to update the user's profile
        // await axios.put(`http://localhost:8095/api/users/${user.id}/profile`, formData);

        // Update local storage to reflect "onboarded" status if needed (optional)
        const updatedUser = { ...user, ...formData, isOnboarded: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setMessage('Profile Setup Complete! Redirecting to dashboard...');

        setTimeout(() => {
            navigate('/freelancer-dashboard');
        }, 1500);
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <div className="auth-card onboarding-card" style={{ maxWidth: '600px' }}>
                    <h2 className="auth-title">Complete Your Profile</h2>
                    <p className="auth-subtitle">
                        To match you with the best projects, we need to know your strengths.
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>

                        <div className="auth-input-group">
                            <label className="auth-label">Professional Skills</label>
                            <input
                                name="primarySkill"
                                type="text"
                                placeholder="e.g., Graphic Design, React, Content Writing (comma separated)"
                                className="auth-input"
                                value={formData.primarySkill}
                                onChange={handleChange}
                                required
                            />
                            <span className="auth-caption">List your top skills to get matched with relevant jobs.</span>
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Portfolio Link</label>
                            <input
                                name="portfolioLink"
                                type="url"
                                placeholder="https://dribbble.com/your-profile"
                                className="auth-input"
                                value={formData.portfolioLink}
                                onChange={handleChange}
                                required
                            />
                            <span className="auth-caption">Link to your best work (Behance, GitHub, Personal Site).</span>
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Professional Bio</label>
                            <textarea
                                name="bio"
                                rows="4"
                                placeholder="Briefly describe your experience and what you offer..."
                                className="auth-input"
                                value={formData.bio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-button">Finish Setup</button>
                    </form>

                    {message && (
                        <div className={`auth-message ${message.includes('Complete') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FreelancerOnboarding;
