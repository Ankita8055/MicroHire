import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard,
    Briefcase,
    Search,
    User,
    CheckCircle2,
    LogOut,
    Bell,
    MapPin,
    DollarSign,
    Clock,
    ThumbsUp,
    ExternalLink
} from 'lucide-react';

import './Client.css';

const FreelancerDashboard = () => {
    const [gigs, setGigs] = useState([]);
    const [activeTab, setActiveTab] = useState('feed');
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [freelancerProfile, setFreelancerProfile] = useState(null);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [skillsInput, setSkillsInput] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    // Mock Data for "Active Work" showcase
    const [showcase, setShowcase] = useState({
        title: 'E-commerce Redesign',
        description: 'Redesigned the checkout flow for a major fashion retailer, improving conversion by 15%.',
        link: 'https://dribbble.com/shots/example'
    });
    const [isEditingShowcase, setIsEditingShowcase] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'FREELANCER') {
            navigate('/login');
            return;
        }
        fetchFreelancerProfile();
        fetchGigs();
        fetchAppliedJobs();
    }, []);

    const fetchFreelancerProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8095/api/freelancers/${user.id}`);
            setFreelancerProfile(response.data);
            setSkillsInput(response.data.skills || '');
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchGigs = async () => {
        try {
            const response = await axios.get('http://localhost:8095/api/jobs/all');
            const jobs = response.data.map(job => ({
                id: job.id,
                title: job.title,
                clientName: job.clientName || 'Verified Client',
                budget: `₹${job.budget}`,
                deadline: job.deadline,
                description: job.description,
                requiredSkills: job.requiredSkills || ''
            }));
            setGigs(jobs);
        } catch (error) {
            console.error("Error fetching gigs:", error);
        }
    };

    const fetchAppliedJobs = async () => {
        // ideally fetch from backend, but for now we might rely on button state or local storage if endpoints missing
        // or check applications endpoint if available
    };

    const calculateMatch = (jobSkillsString) => {
        if (!freelancerProfile?.skills || !jobSkillsString) return 0;

        // Robust split: comma, semicolon, newline
        const fSkills = freelancerProfile.skills.split(/[,;|\n]+/).map(s => s.trim().toLowerCase()).filter(s => s);
        const jSkills = jobSkillsString.split(/[,;|\n]+/).map(s => s.trim().toLowerCase()).filter(s => s);

        if (jSkills.length === 0) return 0;

        let matchCount = 0;
        // Use Set for O(1) matching if large, but simple loop is fine
        jSkills.forEach(jSkill => {
            if (fSkills.includes(jSkill)) matchCount++;
        });

        return Math.min(100, Math.round((matchCount / jSkills.length) * 100));
    };

    const handleApply = async (jobId) => {
        try {
            await axios.post('http://localhost:8095/api/applications', {
                jobId: jobId,
                freelancerId: user.id
            });
            setMessage('Application sent successfully!');
            setAppliedJobIds([...appliedJobIds, jobId]);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data || 'Failed to apply.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleSaveSkills = async () => {
        try {
            await axios.put(`http://localhost:8095/api/freelancers/${user.id}`, {
                ...freelancerProfile,
                skills: skillsInput
            });
            fetchFreelancerProfile();
            setMessage('Skills updated!');
            setTimeout(() => setMessage(''), 2000);
        } catch (error) {
            setMessage('Failed to update skills');
        }
    };

    const handleSaveShowcase = (e) => {
        e.preventDefault();
        setIsEditingShowcase(false);
        setMessage('Showcase updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'feed':
                return (
                    <div className="prof-content-fade-in my-gigs-section">
                        <div className="marketplace-filters">
                            <div className="search-wrapper">
                                <Search className="search-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search specific skills or projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="prof-primary-btn" style={{ width: 'auto' }}>Search</button>
                        </div>

                        {message && <div className="success-banner"><CheckCircle2 size={16} /> {message}</div>}

                        <div className="prof-gig-grid">
                            {gigs.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase())).map((gig) => {
                                const matchPercent = calculateMatch(gig.requiredSkills);
                                const isApplied = appliedJobIds.includes(gig.id);
                                return (
                                    <div key={gig.id} className="prof-gig-card">
                                        <div className="prof-gig-top">
                                            <div className="client-badge">
                                                <div className="client-avatar">{gig.clientName.charAt(0)}</div>
                                                <span>{gig.clientName}</span>
                                            </div>
                                            <div className="budget-pill">{gig.budget}</div>
                                        </div>
                                        <div className="prof-gig-body">
                                            <h3>{gig.title}</h3>
                                            <p>{gig.description}</p>
                                            <div className="prof-tags-row">
                                                {gig.requiredSkills && gig.requiredSkills.split(',').map(tag => <span key={tag} className="prof-tag-small">{tag.trim()}</span>)}
                                            </div>
                                            {matchPercent > 0 && <div style={{ marginTop: '10px', color: matchPercent > 70 ? 'green' : 'orange', fontWeight: 'bold' }}>{matchPercent}% Match</div>}
                                        </div>
                                        <div className="prof-gig-footer">
                                            <div className="prof-meta">
                                                <Clock size={14} />
                                                <span>Deadline: {new Date(gig.deadline).toLocaleDateString()}</span>
                                            </div>
                                            <button
                                                className={`prof-primary-btn small-btn ${isApplied ? 'disabled' : ''}`}
                                                onClick={() => !isApplied && handleApply(gig.id)}
                                                disabled={isApplied}
                                                style={isApplied ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
                                            >
                                                <ThumbsUp size={16} style={{ marginRight: '5px' }} />
                                                {isApplied ? 'Applied' : "I'm Interested"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="prof-content-fade-in profile-section">
                        <div className="prof-profile-header">
                            <div className="prof-avatar-box">
                                <div className="prof-avatar freelancer-avatar">
                                    {user?.fullName?.charAt(0)}
                                </div>
                            </div>
                            <div className="prof-profile-info">
                                <div className="prof-title-row">
                                    <h1>{user?.fullName}</h1>
                                    <span className="prof-account-type">Freelancer</span>
                                </div>
                                <div className="prof-bio">
                                    <p>Passionate freelancer ready to deliver high-quality work.</p>
                                </div>
                            </div>
                        </div>

                        <div className="prof-section-divider">
                            <h2>Your Skills</h2>
                        </div>
                        <div className="post-job-card" style={{ padding: '20px' }}>
                            <div className="form-group full-width">
                                <label>My Skills (Comma separated)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        value={skillsInput}
                                        onChange={(e) => setSkillsInput(e.target.value)}
                                        placeholder="React, Node.js, Design..."
                                    />
                                    <button className="prof-primary-btn" onClick={handleSaveSkills} style={{ width: 'auto' }}>Save</button>
                                </div>
                            </div>
                        </div>

                        <div className="prof-section-divider">
                            <h2>My Active Work Showcase</h2>
                            <p>This is what Clients will see when you apply.</p>
                        </div>

                        <div className="showcase-card">
                            {isEditingShowcase ? (
                                <form onSubmit={handleSaveShowcase} className="job-form">
                                    <div className="form-group full-width">
                                        <label>Project Title</label>
                                        <input type="text" value={showcase.title} onChange={e => setShowcase({ ...showcase, title: e.target.value })} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea rows="3" value={showcase.description} onChange={e => setShowcase({ ...showcase, description: e.target.value })} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Project Link</label>
                                        <input type="text" value={showcase.link} onChange={e => setShowcase({ ...showcase, link: e.target.value })} />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="prof-primary-btn">Save Showcase</button>
                                        <button type="button" className="prof-secondary-btn" onClick={() => setIsEditingShowcase(false)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="showcase-display">
                                    <div className="showcase-header">
                                        <h3>{showcase.title}</h3>
                                        <button className="prof-edit-btn" onClick={() => setIsEditingShowcase(true)}>Edit</button>
                                    </div>
                                    <p>{showcase.description}</p>
                                    <a href={showcase.link} target="_blank" rel="noopener noreferrer" className="showcase-link">
                                        <ExternalLink size={16} /> View Project
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="prof-dashboard-wrapper">
            <aside className="prof-sidebar">
                <div className="prof-sidebar-logo">
                    <Briefcase className="logo-icon" />
                    <span className="logo-text">Freelancer<span className="logo-bold">Dashboard</span></span>
                </div>

                <nav className="prof-nav">
                    <button
                        className={`prof-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('feed')}
                    >
                        <Search size={20} />
                        <span className="nav-label">Gig Feed</span>
                    </button>

                    <button
                        className={`prof-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        <span className="nav-label">Profile & Showcase</span>
                    </button>
                </nav>

                <div className="prof-sidebar-bottom">
                    <button className="prof-logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="prof-main-body">
                <header className="prof-top-bar">
                    <div className="breadcrumb">
                        <span>Workspace</span> / <span className="active">{activeTab === 'feed' ? 'Gig Feed' : 'Profile'}</span>
                    </div>
                    <div className="user-menu-mini">
                        <span>{user?.fullName}</span>
                        <div className="mini-avatar">{user?.fullName?.charAt(0)}</div>
                    </div>
                </header>
                <div className="prof-content-scroll">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
};

export default FreelancerDashboard;
