import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './AdminServices.css';

const CATEGORIES = ['wedding', 'baby-shower', 'birthday', 'anniversary', 'food', 'other'];
const EMPTY_FORM = { title: '', category: 'wedding', icon: '🎁', shortDescription: '', description: '', features: '', isActive: true, order: 0 };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/services');
      setServices(data.data || []);
    } catch { toast.error('Failed to load services'); }
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setImageFile(null); setShowForm(true); };

  const openEdit = (s) => {
    setForm({ ...s, features: s.features?.join(', ') || '' });
    setEditId(s._id);
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editId) {
        await API.put(`/services/${editId}`, fd);
        toast.success('Service updated!');
      } else {
        await API.post('/services', fd);
        toast.success('Service added!');
      }
      setShowForm(false);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      toast.success('Deleted');
      fetchServices();
    } catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await API.put(`/services/${id}`, { isActive: !isActive });
      fetchServices();
    } catch {}
  };

  return (
    <div className="admin-services">
      <div className="page-header">
        <div>
          <h1>Services</h1>
          <p>Manage your packing services shown on the website</p>
        </div>
        <button className="add-btn" onClick={openAdd}>+ Add Service</button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : (
        <div className="services-admin-grid">
          {services.map(s => (
            <div key={s._id} className={`service-admin-card ${!s.isActive ? 'inactive' : ''}`}>
              <div className="sac-top">
                <div className="sac-icon">{s.icon}</div>
                <div className="sac-meta">
                  <span className="sac-category">{s.category}</span>
                  <span className={`sac-status ${s.isActive ? 'active' : 'off'}`}>
                    {s.isActive ? '● Active' : '○ Hidden'}
                  </span>
                </div>
              </div>
              <h3>{s.title}</h3>
              <p>{s.shortDescription || s.description?.substring(0, 80) + '...'}</p>
              {s.features?.length > 0 && (
                <div className="sac-features">
                  {s.features.slice(0, 3).map((f, i) => <span key={i}>{f}</span>)}
                </div>
              )}
              <div className="sac-actions">
                <button onClick={() => openEdit(s)} className="edit-btn">✏️ Edit</button>
                <button onClick={() => toggleActive(s._id, s.isActive)} className="toggle-btn">
                  {s.isActive ? '👁 Hide' : '👁 Show'}
                </button>
                <button onClick={() => handleDelete(s._id)} className="del-btn">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="mf-row">
                <div className="mf-group">
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Lehenga Packing" />
                </div>
                <div className="mf-group">
                  <label>Icon (Emoji)</label>
                  <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="🎁" />
                </div>
              </div>
              <div className="mf-row">
                <div className="mf-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mf-group">
                  <label>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
                </div>
              </div>
              <div className="mf-group">
                <label>Short Description</label>
                <input value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} placeholder="One-line summary" />
              </div>
              <div className="mf-group">
                <label>Full Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} required />
              </div>
              <div className="mf-group">
                <label>Features (comma separated)</label>
                <input value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} placeholder="Premium wrapping, Floral decoration, Name tag" />
              </div>
              <div className="mf-group">
                <label>Service Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                {form.image && !imageFile && <img src={`http://localhost:5000${form.image}`} alt="" className="preview-img" />}
              </div>
              <div className="mf-group check-group">
                <label><input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} /> Active (visible on website)</label>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                <button type="submit" disabled={saving} className="save-btn">{saving ? 'Saving...' : editId ? 'Update Service' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
