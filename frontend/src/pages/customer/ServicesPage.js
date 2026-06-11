import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import './ServicesPage.css';

const CATEGORIES = [
  { value: '', label: 'All Services' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'baby-shower', label: 'Baby Shower' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'food', label: 'Food Items' },
];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices('');
    API.get('/settings')
      .then(({ data }) => setSettings(data.data || {}))
      .catch(() => {});
  }, []);

  const fetchServices = async (cat) => {
    setLoading(true);
    setError('');
    try {
      const url = cat ? `/services?category=${cat}` : '/services';
      const { data } = await API.get(url);
      const list = data.data || [];
      setServices(list);
      if (list.length === 0) setError('No services found for this category.');
    } catch (e) {
      setError('Could not load services. Please make sure backend is running.');
    }
    setLoading(false);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    fetchServices(cat);
  };

  return (
    <div className="services-page">
      <Navbar settings={settings} />

      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <h1>Our Services</h1>
          <p>Beautifully crafted packing for every special occasion</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>Services</span>
          </div>
        </div>
      </div>

      <section className="services-section">
        <div className="container">

          {/* CATEGORY FILTER BUTTONS */}
          <div className="category-filters">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                className={`filter-btn ${activeCategory === c.value ? 'active' : ''}`}
                onClick={() => handleCategory(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="loading-center">
              <div className="spinner" />
              <p style={{ marginTop: 16, color: 'var(--text-light)' }}>Loading services...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="error-box">
              <div style={{ fontSize: '3rem' }}>⚠️</div>
              <h3>{error}</h3>
              <p>Make sure your backend server is running on port 5000</p>
              <button
                onClick={() => fetchServices(activeCategory)}
                className="btn btn-primary"
                style={{ marginTop: 16 }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* SERVICES LIST */}
          {!loading && !error && services.length > 0 && (
            <div className="services-full-grid">
              {services.map((service, i) => (
                <div
                  className="service-full-card"
                  key={service._id}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* LEFT — Icon & Category */}
                  <div className="sfc-icon-col">
                    <div className="sfc-icon">{service.icon}</div>
                    <div className="sfc-category">{service.category}</div>
                  </div>

                  {/* MIDDLE — Content */}
                  <div className="sfc-body">
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>

                    {service.features && service.features.length > 0 && (
                      <div className="sfc-features">
                        <h4>What's Included:</h4>
                        <ul>
                          {service.features.map((f, fi) => (
                            <li key={fi}>
                              <span className="check">✓</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link to="/enquiry" className="btn btn-primary sfc-cta">
                      Get Quote for This
                    </Link>
                  </div>

                  {/* RIGHT — Image if available */}
                  {service.image && (
                    <div className="sfc-image">
                      <img
                        src={`http://localhost:5000${service.image}`}
                        alt={service.title}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default ServicesPage;