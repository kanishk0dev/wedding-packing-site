import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import API from '../../utils/api';
import './ContactPage.css';

const ContactPage = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    API.get('/settings').then(({ data }) => setSettings(data.data || {})).catch(() => {});
  }, []);

  const whatsappNum = settings?.whatsapp?.replace(/\D/g, '') || '919876543210';

  return (
    <div className="contact-page">
      <Navbar settings={settings} />

      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
          <div className="breadcrumb"><Link to="/">Home</Link> / <span>Contact</span></div>
        </div>
      </div>

      <section className="contact-section">
        <div className="container contact-layout">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Whether you have a question about our services, pricing, or just want to discuss your upcoming event — we're here to help!</p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div>
                  <h4>Visit Us</h4>
                  <p>{settings?.address || 'Jaipur, Rajasthan, India'}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📞</div>
                <div>
                  <h4>Call Us</h4>
                  <a href={`tel:${settings?.phone}`}>{settings?.phone || '+91 98765 43210'}</a>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">✉️</div>
                <div>
                  <h4>Email Us</h4>
                  <a href={`mailto:${settings?.email}`}>{settings?.email || 'info@shringaar.com'}</a>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🕐</div>
                <div>
                  <h4>Working Hours</h4>
                  <p>Mon – Sat: 9 AM – 8 PM<br />Sunday: 10 AM – 5 PM</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappNum}?text=Hi! I'm interested in your packing services.`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
          </div>

          <div className="map-placeholder">
            <div className="map-box">
              <div className="map-pin">📍</div>
              <h3>Shringaar Packing Studio</h3>
              <p>{settings?.address || 'Jaipur, Rajasthan'}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Jaipur Rajasthan')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.875rem', padding: '10px 20px' }}
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default ContactPage;
