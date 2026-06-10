import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import API from '../../utils/api';
import './EnquiryPage.css';

const SERVICE_OPTIONS = [
  'Lehenga Packing', 'Suit Packing', 'Saree Packing', 'Ring Ceremony Trays',
  'Jewellery Packing', 'Baby Shower Packing', 'Birthday Gift Packing',
  'Anniversary Gift Packing', 'Food Items Packing', 'Other'
];

const EnquiryPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    eventDate: '', eventType: '', services: [],
    message: '', budget: ''
  });

  useEffect(() => {
    API.get('/settings').then(({ data }) => setSettings(data.data || {})).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.eventType || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await API.post('/enquiries', form);
      setSubmitted(true);
      toast.success('Enquiry submitted! We\'ll contact you soon. 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="enquiry-page">
        <Navbar settings={settings} />
        <div className="success-screen">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2>Enquiry Submitted!</h2>
            <p>Thank you for reaching out! Our team will contact you within 24 hours to discuss your requirements.</p>
            <div className="success-details">
              <div className="success-item"><span>Name</span><strong>{form.name}</strong></div>
              <div className="success-item"><span>Phone</span><strong>{form.phone}</strong></div>
              <div className="success-item"><span>Event</span><strong>{form.eventType}</strong></div>
            </div>
            <div className="success-actions">
              <Link to="/" className="btn btn-primary">Go to Home</Link>
              <Link to="/gallery" className="btn btn-outline">View Our Work</Link>
            </div>
          </div>
        </div>
        <Footer settings={settings} />
      </div>
    );
  }

  return (
    <div className="enquiry-page">
      <Navbar settings={settings} />

      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <h1>Place an Enquiry</h1>
          <p>Tell us about your event and we'll create something beautiful</p>
          <div className="breadcrumb"><Link to="/">Home</Link> / <span>Enquiry</span></div>
        </div>
      </div>

      <section className="enquiry-section">
        <div className="container enquiry-layout">
          {/* FORM */}
          <div className="enquiry-form-wrap">
            <form onSubmit={handleSubmit} className="enquiry-form">
              <h2>Tell Us About Your Event</h2>
              <p className="form-sub">Fill in the details and we'll get back to you within 24 hours.</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@example.com" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Jaipur" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Type *</label>
                  <select name="eventType" value={form.eventType} onChange={handleChange} required>
                    <option value="">Select Event Type</option>
                    <option value="wedding">Wedding</option>
                    <option value="baby-shower">Baby Shower</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="food">Food Items</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Event Date</label>
                  <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="form-group">
                <label>Budget Range</label>
                <select name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">Select Budget</option>
                  <option value="under-5k">Under ₹5,000</option>
                  <option value="5k-15k">₹5,000 – ₹15,000</option>
                  <option value="15k-50k">₹15,000 – ₹50,000</option>
                  <option value="50k-1l">₹50,000 – ₹1,00,000</option>
                  <option value="above-1l">Above ₹1,00,000</option>
                </select>
              </div>

              <div className="form-group">
                <label>Services Required</label>
                <div className="checkbox-grid">
                  {SERVICE_OPTIONS.map(s => (
                    <label key={s} className="checkbox-label">
                      <input type="checkbox" name="services" value={s}
                        checked={form.services.includes(s)} onChange={handleChange} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Message / Requirements *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your requirements, quantity, special requests, design preferences..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                {loading ? '⏳ Submitting...' : '🚀 Submit Enquiry'}
              </button>
            </form>
          </div>

          {/* SIDEBAR */}
          <div className="enquiry-sidebar">
            <div className="contact-card">
              <h3>Get in Touch Directly</h3>
              <div className="contact-methods">
                <a href={`tel:${settings?.phone || ''}`} className="contact-method">
                  <div className="cm-icon">📞</div>
                  <div>
                    <div className="cm-label">Call Us</div>
                    <div className="cm-value">{settings?.phone || '+91 98765 43210'}</div>
                  </div>
                </a>
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="contact-method">
                    <div className="cm-icon">💬</div>
                    <div>
                      <div className="cm-label">WhatsApp</div>
                      <div className="cm-value">{settings.whatsapp}</div>
                    </div>
                  </a>
                )}
                <a href={`mailto:${settings?.email || ''}`} className="contact-method">
                  <div className="cm-icon">✉️</div>
                  <div>
                    <div className="cm-label">Email</div>
                    <div className="cm-value">{settings?.email || 'info@shringaar.com'}</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="why-enquire">
              <h3>Why Choose Us?</h3>
              {['Free consultation and design preview', 'Bulk order discounts available',
                'Same day enquiry response', 'Custom designs for any budget',
                'Delivery across Rajasthan'].map((p, i) => (
                <div key={i} className="why-point"><span>✦</span>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default EnquiryPage;
