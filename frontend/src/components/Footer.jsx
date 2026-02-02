import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-copyright">
                    © {new Date().getFullYear()} FreelancerConnect. All rights reserved.
                </div>
                <div className="footer-buttons">
                    <button className="footer-btn">Support</button>
                    <button className="footer-btn contact-btn">Contact Us</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
