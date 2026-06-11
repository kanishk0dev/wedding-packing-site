import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: '📬' },
  { to: '/admin/services', label: 'Services', icon: '🎁' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">✦</span>
            {sidebarOpen && (
              <div>
                <div className="sidebar-brand-name">Shringaar</div>
                <div className="sidebar-brand-sub">Admin Panel</div>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="sidebar-user">
              <div className="user-avatar">{user?.name?.[0]}</div>
              <div>
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            {sidebarOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-left">
            <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          </div>
          <div className="topbar-right">
            <a href="/" target="_blank" rel="noreferrer" className="view-site-btn">
              🌐 View Website
            </a>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
