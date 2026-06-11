import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import './AdminDashboard.css';

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} className="stat-card" style={{ '--card-color': color }}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-info">
      <div className="stat-card-value">{value ?? '—'}</div>
      <div className="stat-card-label">{label}</div>
    </div>
    <div className="stat-card-arrow">→</div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/enquiries/stats'),
      API.get('/enquiries?limit=5'),
    ]).then(([s, e]) => {
      setStats(s.data.data);
      setRecentEnquiries(e.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    new: '#E8F4FF',
    contacted: '#FFF8E6',
    'in-progress': '#F0F8FF',
    completed: '#E8F8F0',
    cancelled: '#FFF0F0',
  };

  const STATUS_TEXT = {
    new: '#1A6EBD',
    contacted: '#B07800',
    'in-progress': '#0066AA',
    completed: '#1A8A50',
    cancelled: '#CC3333',
  };

  if (loading) return (
    <div className="dash-loading"><div className="spinner" /></div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your studio.</p>
        </div>
        <Link to="/admin/enquiries" className="dash-btn">View All Enquiries →</Link>
      </div>

      {/* STAT CARDS */}
      <div className="stat-cards-grid">
        <StatCard icon="📬" label="Total Enquiries" value={stats?.total} color="#8B1A4A" to="/admin/enquiries" />
        <StatCard icon="🆕" label="New Enquiries" value={stats?.new} color="#D4A843" to="/admin/enquiries?status=new" />
        <StatCard icon="📞" label="Contacted" value={stats?.contacted} color="#2E86C1" to="/admin/enquiries?status=contacted" />
        <StatCard icon="✅" label="Completed" value={stats?.completed} color="#1E8449" to="/admin/enquiries?status=completed" />
      </div>

      {/* UNREAD ALERT */}
      {stats?.unread > 0 && (
        <div className="unread-alert">
          <span>🔔</span>
          <span>You have <strong>{stats.unread} unread</strong> enquiries waiting for your attention.</span>
          <Link to="/admin/enquiries">View Now →</Link>
        </div>
      )}

      {/* RECENT ENQUIRIES */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2>Recent Enquiries</h2>
          <Link to="/admin/enquiries">See All</Link>
        </div>
        {recentEnquiries.length === 0 ? (
          <div className="empty-state">
            <div>📭</div>
            <p>No enquiries yet. They'll show up here once customers submit.</p>
          </div>
        ) : (
          <div className="enquiries-table-wrap">
            <table className="enquiries-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Event Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map(enq => (
                  <tr key={enq._id} className={!enq.isRead ? 'unread-row' : ''}>
                    <td>
                      <div className="enq-name">
                        {!enq.isRead && <span className="unread-dot" />}
                        {enq.name}
                      </div>
                    </td>
                    <td>{enq.phone}</td>
                    <td><span className="event-tag">{enq.eventType}</span></td>
                    <td>{new Date(enq.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className="status-badge"
                        style={{ background: STATUS_COLORS[enq.status], color: STATUS_TEXT[enq.status] }}>
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK LINKS */}
      <div className="dash-section">
        <div className="dash-section-header"><h2>Quick Actions</h2></div>
        <div className="quick-actions">
          {[
            { icon: '🎁', label: 'Add New Service', to: '/admin/services', desc: 'Add or edit packing services' },
            { icon: '🖼️', label: 'Upload to Gallery', to: '/admin/gallery', desc: 'Add new gallery photos' },
            { icon: '⭐', label: 'Manage Testimonials', to: '/admin/testimonials', desc: 'Add customer reviews' },
            { icon: '⚙️', label: 'Site Settings', to: '/admin/settings', desc: 'Update contact & branding info' },
          ].map(a => (
            <Link to={a.to} key={a.to} className="quick-action-card">
              <div className="qa-icon">{a.icon}</div>
              <div className="qa-label">{a.label}</div>
              <div className="qa-desc">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
