import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Zap, Code2, Users, Layers, MessageSquare } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />

            {/* Hero Section */}
            <header className="about-hero">
                <div className="container">
                    <h1 className="about-title">Why <span className="logo-accent">FreelancerConnect?</span></h1>
                    <p className="about-subtitle">
                        Streamlinining freelance engagement with a focus on efficiency, security, and micro-projects.
                    </p>
                </div>
            </header>

            {/* Main Abstract Content */}
            <main className="container about-content">

                {/* Mission Section */}
                <section className="about-section">
                    <div className="section-grid">
                        <div className="text-content">
                            <h2 className="section-title">Our Mission</h2>
                            <p className="section-text">
                                FreelancerConnect is an online platform designed to connect clients and freelancers efficiently for project-based work focused on <strong>micro-projects</strong> such as logo design, content creation, and quick fixes.
                            </p>
                            <p className="section-text">
                                Clients can post small, well-defined projects specifying detailed descriptions, budgets, and deadlines. Freelancers browse available projects by category or skills and <strong>directly accept jobs</strong> without engaging in complex bidding processes, enabling faster job assignments and quicker project completion.
                            </p>
                        </div>
                        <div className="icon-box">
                            <Zap size={64} className="feature-icon" />
                        </div>
                    </div>
                </section>

                {/* Technical Features Section */}
                <section className="about-section bg-light">
                    <h2 className="section-title center">Technical Architecture</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <Shield className="card-icon" />
                            <h3>Secure Authentication</h3>
                            <p>Robust user registration and authentication using <strong>JWT tokens</strong> ensures data privacy and secure access for all users.</p>
                        </div>
                        <div className="feature-card">
                            <Code2 className="card-icon" />
                            <h3>Modern Stack</h3>
                            <p>Built with <strong>React.js</strong> for a dynamic, responsive frontend and <strong>Spring Boot</strong> for scalable backend RESTful APIs.</p>
                        </div>
                        <div className="feature-card">
                            <MessageSquare className="card-icon" />
                            <h3>Real-Time Updates</h3>
                            <p>Communication and notifications powered by <strong>WebSocket</strong> technology for instant status updates and interaction.</p>
                        </div>
                    </div>
                </section>

                {/* Key Modules Section */}
                <section className="about-section">
                    <h2 className="section-title center">Key Platform Modules</h2>
                    <div className="modules-list">
                        <div className="module-item">
                            <Users size={24} />
                            <span>User Management (Clients, Freelancers, Admins)</span>
                        </div>
                        <div className="module-item">
                            <Layers size={24} />
                            <span>Project Posting & Direct Acceptance</span>
                        </div>
                        <div className="module-item">
                            <Zap size={24} />
                            <span>Deliverable Uploads & Reviews</span>
                        </div>
                    </div>
                    <p className="summary-text">
                        The platform prioritizes simplicity, scalability, security, and responsiveness to foster a productive and collaborative environment. This project addresses the growing need for streamlined freelance engagement by offering essential functionalities in an easy-to-use web-based system.
                    </p>
                </section>

                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>How It Works</Title>

                <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Timeline mode="alternate">
                        <Timeline.Item color="blue">
                            <Title level={5}>Registration</Title>
                            <Text>Users sign up as Client or Freelancer.</Text>
                        </Timeline.Item>
                        <Timeline.Item color="green">
                            <Title level={5}>Post Project</Title>
                            <Text>Client creates a project with budget and deadline.</Text>
                        </Timeline.Item>
                        <Timeline.Item color="red">
                            <Title level={5}>Contract Assignment</Title>
                            <Text>Client assigns contract directly to a Freelancer.</Text>
                        </Timeline.Item>
                        <Timeline.Item color="orange">
                            <Title level={5}>Completion & Review</Title>
                            <Text>Work is delivered. Client leaves a Rating & Comment.</Text>
                        </Timeline.Item>
                    </Timeline>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default About;
