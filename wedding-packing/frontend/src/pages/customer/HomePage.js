import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import API from '../../utils/api';
import './HomePage.css';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    Promise.all([
      API.get('/services?limit=6'),
      API.get('/gallery?featured=true&limit=6'),
      API.get('/testimonials'),
      API.get('/settings')
    ]).then(([s, g, t, set]) => {
      setServices(s.data.data || []);
      setGallery(g.data.data || []);
      setTestimonials(t.data.data || []);
      setSettings(set.data.data || {});
    }).catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <Navbar settings={settings} />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-pattern" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">✦ Premium Packing Studio</div>
          <h1 className="hero-title">
            Beautiful Packing for<br />
            <em>Your Special Moments</em>
          </h1>
          <p className="hero-sub">
            From bridal lehengas to anniversary gifts — we wrap your love with elegance. Serving Jaipur and beyond.
          </p>
          <div className="hero-buttons">
            <Link to="/enquiry" className="btn btn-primary">Place an Enquiry</Link>
            <Link to="/gallery" className="btn btn-outline">View Our Work</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Happy Clients</div></div>
            <div className="stat-divider" />
            <div className="stat"><div className="stat-num">9+</div><div className="stat-label">Services</div></div>
            <div className="stat-divider" />
            <div className="stat"><div className="stat-num">5★</div><div className="stat-label">Rated</div></div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-us">
        <div className="container">
          <div className="why-grid">
            {[
              { icon: '🎨', title: 'Handcrafted with Love', desc: 'Every piece is carefully crafted by our skilled artisans with attention to detail.' },
              { icon: '⚡', title: 'On-Time Delivery', desc: 'We understand the importance of your event dates. Never miss a deadline.' },
              { icon: '💰', title: 'Affordable Pricing', desc: 'Premium quality packing at prices that don\'t break your budget.' },
              { icon: '🎁', title: 'Custom Themes', desc: 'Personalized designs matching your event color scheme and preferences.' },
            ].map((item, i) => (
              <div className="why-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-preview">
        <div className="container">
          <div className="section-badge">What We Offer</div>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">From intimate gatherings to grand weddings, we offer packing for every special occasion.</p>
          <div className="services-grid">
            {services.length > 0 ? services.map((service, i) => (
              <div className="service-card" key={service._id} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="service-icon-wrap">
                  <span className="service-icon">{service.icon}</span>
                </div>
                <div className="service-body">
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription || service.description?.substring(0, 80) + '...'}</p>
                  {service.features?.length > 0 && (
                    <ul className="service-features">
                      {service.features.slice(0, 3).map((f, fi) => (
                        <li key={fi}>✓ {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )) : (
              // Fallback cards
              ['Lehenga Packing 👗', 'Suit Packing 🤵', 'Saree Packing 🥻', 'Ring Ceremony Trays 💍', 'Baby Shower 👶', 'Birthday Gifts 🎂'].map((s, i) => (
                <div className="service-card" key={i}>
                  <div className="service-icon-wrap"><span className="service-icon">{s.split(' ').pop()}</span></div>
                  <div className="service-body">
                    <h3>{s.split(' ').slice(0, -1).join(' ')}</h3>
                    <p>Beautiful and elegant packing for your special occasion</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="services-cta">
            <Link to="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="gallery-preview">
          <div className="container">
            <div className="section-badge">Our Portfolio</div>
            <h2 className="section-title">Gallery</h2>
            <p className="section-subtitle">A glimpse of our beautifully crafted packing work.</p>
            <div className="gallery-grid">
              {gallery.map((item, i) => (
                <div className="gallery-item" key={item._id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <img src={`http://localhost:5000${item.image}`} alt={item.title} loading="lazy" />
                  <div className="gallery-overlay">
                    <span>{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="services-cta">
              <Link to="/gallery" className="btn btn-outline">View Full Gallery</Link>
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section className="process-section">
        <div className="container">
          <div className="section-badge">How It Works</div>
          <h2 className="section-title">Simple 4-Step Process</h2>
          <div className="process-steps">
            {[
              { step: '01', title: 'Place Enquiry', desc: 'Fill out our enquiry form with your event details and service requirements.' },
              { step: '02', title: 'Consultation', desc: 'Our team contacts you to discuss design, budget, and customization options.' },
              { step: '03', title: 'Crafting', desc: 'Our artisans craft your custom packing with premium materials and love.' },
              { step: '04', title: 'Delivery', desc: 'Your beautifully packed items delivered on time for your special occasion.' },
            ].map((s, i) => (
              <div className="process-step" key={i}>
                <div className="step-number">{s.step}</div>
                <div className="step-connector" />
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="testimonials">
          <div className="container">
            <div className="section-badge">Happy Customers</div>
            <h2 className="section-title">What They Say</h2>
            <div className="testimonials-grid">
              {testimonials.slice(0, 4).map(t => (
                <div className="testimonial-card" key={t._id}>
                  <div className="stars">{'⭐'.repeat(t.rating)}</div>
                  <p>"{t.message}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.name[0]}</div>
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-loc">{t.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make Your Occasion Unforgettable?</h2>
            <p>Get in touch with us today and let us create something beautiful for you.</p>
            <div className="cta-buttons">
              <Link to="/enquiry" className="btn btn-gold">Place Enquiry Now</Link>
              <a href={`tel:${settings?.phone || '+919876543210'}`} className="btn btn-outline-white">
                📞 Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default HomePage;
