import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ settings }) => {
  const siteName = settings?.siteName || 'Shringaar Packing Studio';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'info@shringaarpacking.com';
  const address = settings?.address || 'Jaipur, Rajasthan, India';

  return (
    <footer className="footer">
      <div className="footer-pattern" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="brand-icon">✦</span>
            <div>
              <div className="brand-name">{siteName.split(' ')[0]}</div>
              <div className="brand-sub">Packing Studio</div>
            </div>
          </div>
          <p className="footer-desc">
            Crafting beautiful memories through exquisite packing for weddings, celebrations, and every special occasion.
          </p>
          <div className="footer-social">
            {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer">📸</a>}
            {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer">📘</a>}
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">💬</a>
            )}
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/enquiry">Get Quote</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">Wedding Packing</Link></li>
            <li><Link to="/services">Lehenga & Suits</Link></li>
            <li><Link to="/services">Ring Ceremony Trays</Link></li>
            <li><Link to="/services">Baby Shower</Link></li>
            <li><Link to="/services">Birthday Gifts</Link></li>
            <li><Link to="/services">Anniversary Gifts</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact">
            <div className="contact-item">
              <span>📍</span>
              <span>{address}</span>
            </div>
            <div className="contact-item">
              <span>📞</span>
              <a href={`tel:${phone}`}>{phone}</a>
            </div>
            <div className="contact-item">
              <span>✉️</span>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>
          <Link to="/enquiry" className="btn btn-gold footer-cta">Place Enquiry</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p>Made with ❤️ for every special occasion</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
