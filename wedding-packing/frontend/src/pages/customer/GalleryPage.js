import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import API from '../../utils/api';
import './GalleryPage.css';

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const categories = [...new Set(gallery.map(g => g.category).filter(Boolean))];

  useEffect(() => {
    Promise.all([
      API.get('/gallery'),
      API.get('/settings')
    ]).then(([g, s]) => {
      setGallery(g.data.data || []);
      setSettings(s.data.data || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter ? gallery.filter(g => g.category === filter) : gallery;

  return (
    <div className="gallery-page">
      <Navbar settings={settings} />

      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <h1>Our Gallery</h1>
          <p>Explore our portfolio of beautiful packing work</p>
          <div className="breadcrumb"><Link to="/">Home</Link> / <span>Gallery</span></div>
        </div>
      </div>

      <section className="gallery-section">
        <div className="container">
          {categories.length > 0 && (
            <div className="category-filters">
              <button className={`filter-btn ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
              {categories.map(cat => (
                <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-gallery">
              <div style={{ fontSize: '4rem' }}>🖼️</div>
              <h3>Gallery Coming Soon</h3>
              <p>We're adding beautiful photos of our work. Check back soon!</p>
            </div>
          ) : (
            <div className="masonry-grid">
              {filtered.map((item, i) => (
                <div
                  className="masonry-item"
                  key={item._id}
                  onClick={() => setSelected(item)}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <img src={`http://localhost:5000${item.image}`} alt={item.title} loading="lazy" />
                  <div className="masonry-overlay">
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  {item.isFeatured && <div className="featured-badge">✦ Featured</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)}>✕</button>
            <img src={`http://localhost:5000${selected.image}`} alt={selected.title} />
            <div className="lightbox-info">
              <h3>{selected.title}</h3>
              {selected.description && <p>{selected.description}</p>}
              {selected.category && <span className="cat-tag">{selected.category}</span>}
            </div>
          </div>
        </div>
      )}

      <Footer settings={settings} />
    </div>
  );
};

export default GalleryPage;
