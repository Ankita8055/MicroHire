import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard,
    Briefcase,
    Mail,
    User,
    PlusCircle,
    LogOut,
    Bell,
    CheckCircle2,
    Calendar,
    DollarSign,
    MoreHorizontal,
    TrendingUp,
    Shield,
    Users
} from 'lucide-react';
import './Client.css';

const ClientDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        requiredSkills: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-gigs');

    // New States
    const [notifications, setNotifications] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'CLIENT') {
            navigate('/login');
            return;
        }
        fetchJobs();
        fetchNotifications();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`http://localhost:8095/api/jobs/client/${user.id}`);
            // Force status to 'OPEN' for demonstration
            const jobsWithStatus = response.data.map(job => ({ ...job, status: 'OPEN' }));
            setJobs(jobsWithStatus);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8095/api/notifications/${user.id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const fetchApplications = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:8095/api/applications/job/${jobId}`);
            setApplications(response.data);
            setActiveTab('applications');
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const jobData = {
                ...formData,
                clientId: user.id,
                clientName: user.fullName
            };
            await axios.post('http://localhost:8095/api/jobs/post', jobData);
            setMessage('Job posted successfully!');
            setFormData({ title: '', description: '', budget: '', deadline: '', requiredSkills: '' });
            fetchJobs();
            setTimeout(() => {
                setMessage('');
                setActiveTab('my-gigs');
            }, 2000);
        } catch (error) {
            setMessage('Failed to post job. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'post-job':
                return (
                    <div className="prof-content-fade-in post-job-card">
                        <div className="post-job-header">
                            <h2>Launch New Project</h2>
                            <p>Fill in the details to find the best talent.</p>
                        </div>
                        <form className="job-form" onSubmit={handlePostJob}>
                            <div className="form-group full-width">
                                <label>Project Name</label>
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Website Development with React"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Detailed Description</label>
                                <textarea
                                    name="description"
                                    rows="6"
                                    placeholder="Outline your requirements, deliverables, and goals..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Required Skills (Comma separated)</label>
                                <input
                                    name="requiredSkills"
                                    type="text"
                                    placeholder="e.g. React, Java, SQL"
                                    value={formData.requiredSkills}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-row-grid">
                                <div className="form-group">
                                    <label>Budget Range (₹)</label>
                                    <div className="input-with-icon">
                                        <span style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '8px' }}>₹</span>
                                        <input
                                            name="budget"
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Delivery Date</label>
                                    <input
                                        name="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="prof-primary-btn">Post Opportunity</button>
                        </form>
                        {message && (
                            <div className={`auth-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                );
            case 'my-gigs':
                return (
                    <div className="prof-content-fade-in my-gigs-section">
                        <div className="marketplace-filters">
                            <div className="filter-pill active">All Projects ({jobs.length})</div>
                            <div className="filter-pill">Open</div>
                            <div className="filter-pill">In Progress</div>
                            <div className="filter-pill">Completed</div>
                        </div>
                        {jobs.length === 0 ? (
                            <div className="prof-empty-state">
                                <div className="prof-empty-icon"><Briefcase size={48} /></div>
                                <h3>No Projects Listed</h3>
                                <p>Start by posting your first job to hire top freelancers.</p>
                                <button className="prof-action-link" onClick={() => setActiveTab('post-job')}>Launch a Project</button>
                            </div>
                        ) : (
                            <div className="prof-gig-grid">
                                {jobs.map((job) => (
                                    <div key={job.id} className="prof-gig-card">
                                        <div className="prof-gig-top">
                                            <span className={`status-badge ${job.status?.toLowerCase() || 'open'}`}>
                                                {job.status || 'OPEN'}
                                            </span>
                                            <button className="more-btn"><MoreHorizontal size={18} /></button>
                                        </div>
                                        <div className="prof-gig-body">
                                            <h3>{job.title}</h3>
                                            <p>{job.description.substring(0, 100)}...</p>
                                        </div>
                                        <div className="prof-gig-footer">
                                            <div className="prof-meta">
                                                <span style={{ fontWeight: 'bold' }}>₹</span>
                                                <span>{job.budget}</span>
                                            </div>
                                            <div className="prof-meta">
                                                <Calendar size={14} />
                                                <span>{new Date(job.deadline).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="view-bids-btn"
                                            onClick={() => {
                                                setSelectedJob(job);
                                                fetchApplications(job.id);
                                            }}
                                        >
                                            View Applications
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'applications':
                return (
                    <div className="prof-content-fade-in applications-section">
                        <div className="post-job-header">
                            <h2>Applications for: {selectedJob?.title}</h2>
                            <p>Sorted by best match first.</p>
                            <button className="prof-secondary-btn" onClick={() => setActiveTab('my-gigs')}>Back to Jobs</button>
                        </div>
                        {applications.length === 0 ? (
                            <div className="prof-empty-state">
                                <p>No applications yet.</p>
                            </div>
                        ) : (
                            <div className="prof-gig-grid">
                                {applications.map(app => (
                                    <div key={app.id} className="prof-gig-card">
                                        <div className="prof-gig-top">
                                            <div className="client-badge">
                                                <div className="client-avatar">{app.freelancerName?.charAt(0)}</div>
                                                <span>{app.freelancerName}</span>
                                            </div>
                                            <div className="match-badge" style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                                {app.matchPercentage?.toFixed(0)}% Match
                                            </div>
                                        </div>
                                        <div className="prof-gig-body">
                                            <p><strong>Skills:</strong> {app.freelancerSkills || 'N/A'}</p>
                                            <p><strong>Email:</strong> {app.freelancerEmail}</p>
                                            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="prof-gig-footer">
                                            <button className="prof-primary-btn small-btn">Contact</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'alerts':
                return (
                    <div className="prof-content-fade-in applications-section">
                        <h2>Notifications</h2>
                        <div className="prof-gig-grid" style={{ gridTemplateColumns: '1fr' }}>
                            {notifications.map(notif => (
                                <div key={notif.id} className="prof-gig-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '15px' }}>
                                    <span>{notif.message}</span>
                                    <span style={{ fontSize: '12px', color: '#999' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                            {notifications.length === 0 && <p>No notifications.</p>}
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="prof-content-fade-in profile-section">
                        <div className="prof-profile-header">
                            <div className="prof-avatar-box">
                                <div className="prof-avatar">
                                    {user?.fullName?.charAt(0)}
                                </div>
                                <div className="prof-verified-badge"><Shield size={12} fill="white" /></div>
                            </div>
                            <div className="prof-profile-info">
                                <div className="prof-title-row">
                                    <h1>{user?.fullName}</h1>
                                    <span className="prof-account-type">{user?.role}</span>
                                    <button className="prof-edit-btn">Edit Profile</button>
                                </div>
                                <div className="prof-stats-bar">
                                    <div className="stat-item">
                                        <span className="stat-value">{jobs.length}</span>
                                        <span className="stat-label">Projects Posted</span>
                                    </div>
                                    <div className="stat-divider"></div>
                                    <div className="stat-item">
                                        <span className="stat-value">₹1,250</span>
                                        <span className="stat-label">Total Investment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="prof-section-divider">
                            <h2>Project History</h2>
                        </div>
                        {renderTabContent('my-gigs')}
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
                    <span className="logo-text">Client<span className="logo-bold">Dashboard</span></span>
                </div>

                <nav className="prof-nav">
                    <button
                        className={`prof-nav-item ${activeTab === 'my-gigs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-gigs')}
                    >
                        <LayoutDashboard size={20} />
                        <span className="nav-label">Dashboard</span>
                    </button>

                    <button
                        className={`prof-nav-item ${activeTab === 'post-job' ? 'active' : ''}`}
                        onClick={() => setActiveTab('post-job')}
                    >
                        <PlusCircle size={20} />
                        <span className="nav-label">Post a Job</span>
                    </button>

                    <button
                        className={`prof-nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('alerts')}
                    >
                        <Bell size={20} />
                        <span className="nav-label">Alerts</span>
                        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                    </button>

                    <button
                        className={`prof-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        <span className="nav-label">Company Profile</span>
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
                        <span>Workspace</span> / <span className="active">{activeTab.replace('-', ' ')}</span>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="Search projects or talent..." />
                    </div>
                </header>
                <div className="prof-content-scroll">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
