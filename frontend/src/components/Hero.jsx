import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-content">
                <h1 className="hero-title">Skill-Based Matching Exclusively.</h1>
                <p className="hero-subtitle">
                    No bidding wars. No proposals. Just perfect matches based on skills and experience.
                </p>
                <button className="hero-button">Get Started</button>
            </div>
        </section>
    );
};

export default Hero;
