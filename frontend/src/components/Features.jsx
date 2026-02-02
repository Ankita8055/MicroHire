import React from 'react';
import './Features.css';

const features = [
    {
        title: 'Post a Project',
        description: 'Define your skills and budget. We handle the rest.',
        color: '#ff62ad' // Matching image colors but with professional touch
    },
    {
        title: 'Get Matched',
        description: 'Our algorithm finds the best freelancers instantly.',
        color: '#446ee7'
    },
    {
        title: 'Start Working',
        description: 'Direct assignment and straightforward workflow.',
        color: '#1dbf73'
    }
];

const Features = () => {
    return (
        <section className="features">
            <div className="container">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <h3 className="feature-title" style={{ color: feature.color }}>{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
