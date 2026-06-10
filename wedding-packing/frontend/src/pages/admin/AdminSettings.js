import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './AdminSettings.css';

const AdminSettings = () => {
  const [form, setForm] = useState({
    siteName: '', tagline: '', phone: '', email: '',
    address: '', whatsapp: '', instagram: '', facebook: '',
    youtube: '', heroTitle: '', heroSubtitle: '', aboutText: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // Password change
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    API.get('/settings').then(({ data }) => {
      if (data.data) setForm(prev => ({ ...prev, ...data.data }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
      if (logoFile) fd.append('logo', logoFile);
      await API.put('/settings', fd);
      toast.success('Settings saved successfully!');
    } catch { toast.error('Save failed'); }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPw(true);
    try {
      await API.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setChangingPw(false);
  };

  const TABS = [
    { id: 'general', label: '🏢 General' },
    { id: 'contact', label: '📞 Contact' },
    { id: 'social', label: '📱 Social Media' },
    { id: 'content', label: '📝 Content' },
    { id: 'security', label: '🔒 Security' },
  ];

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;

  return (
    <div className="admin-settings">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your website content and configuration</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Tab Sidebar */}
        <div className="settings-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="settings-form">
              <h2>General Settings</h2>
              <div className="sf-group">
                <label>Site Name *</label>
                <input value={form.siteName} onChange={e => setForm(p => ({ ...p, siteName: e.target.value }))} required />
              </div>
              <div className="sf-group">
                <label>Tagline</label>
                <input value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} placeholder="Crafting Memories, Wrapping Dreams" />
              </div>
              <div className="sf-group">
                <label>Logo</label>
                <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />
                {form.logo && <img src={`http://localhost:5000${form.logo}`} alt="Logo" style={{ marginTop: 8, height: 60, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />}
              </div>
              <button type="submit" className="save-settings-btn" disabled={saving}>{saving ? 'Saving...' : '💾 Save Settings'}</button>
            </form>
          )}

          {activeTab === 'contact' && (
            <form onSubmit={handleSave} className="settings-form">
              <h2>Contact Information</h2>
              <div className="sf-row">
                <div className="sf-group">
                  <label>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
                <div className="sf-group">
                  <label>WhatsApp Number</label>
                  <input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="sf-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="sf-group">
                <label>Address</label>
                <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={3} />
              </div>
              <button type="submit" className="save-settings-btn" disabled={saving}>{saving ? 'Saving...' : '💾 Save Settings'}</button>
            </form>
          )}

          {activeTab === 'social' && (
            <form onSubmit={handleSave} className="settings-form">
              <h2>Social Media Links</h2>
              {[
                { key: 'instagram', label: '📸 Instagram URL', placeholder: 'https://instagram.com/yourpage' },
                { key: 'facebook', label: '📘 Facebook URL', placeholder: 'https://facebook.com/yourpage' },
                { key: 'youtube', label: '▶️ YouTube URL', placeholder: 'https://youtube.com/yourchannel' },
              ].map(s => (
                <div key={s.key} className="sf-group">
                  <label>{s.label}</label>
                  <input value={form[s.key] || ''} onChange={e => setForm(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} />
                </div>
              ))}
              <button type="submit" className="save-settings-btn" disabled={saving}>{saving ? 'Saving...' : '💾 Save Settings'}</button>
            </form>
          )}

          {activeTab === 'content' && (
            <form onSubmit={handleSave} className="settings-form">
              <h2>Website Content</h2>
              <div className="sf-group">
                <label>Hero Title (Homepage Banner)</label>
                <input value={form.heroTitle} onChange={e => setForm(p => ({ ...p, heroTitle: e.target.value }))} />
              </div>
              <div className="sf-group">
                <label>Hero Subtitle</label>
                <input value={form.heroSubtitle || ''} onChange={e => setForm(p => ({ ...p, heroSubtitle: e.target.value }))} />
              </div>
              <div className="sf-group">
                <label>About Us Text</label>
                <textarea value={form.aboutText || ''} onChange={e => setForm(p => ({ ...p, aboutText: e.target.value }))} rows={6} placeholder="Write about your studio, its history, and what makes it special..." />
              </div>
              <button type="submit" className="save-settings-btn" disabled={saving}>{saving ? 'Saving...' : '💾 Save Settings'}</button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="settings-form">
              <h2>Change Password</h2>
              <div className="sf-group">
                <label>Current Password</label>
                <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required />
              </div>
              <div className="sf-group">
                <label>New Password</label>
                <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
              </div>
              <div className="sf-group">
                <label>Confirm New Password</label>
                <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
              </div>
              <button type="submit" className="save-settings-btn" disabled={changingPw}>
                {changingPw ? 'Changing...' : '🔒 Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
