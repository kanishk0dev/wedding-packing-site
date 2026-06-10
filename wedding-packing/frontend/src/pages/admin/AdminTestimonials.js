import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './AdminServices.css';

const EMPTY = { name: '', location: '', message: '', rating: 5, eventType: 'wedding', isActive: true, order: 0 };

const AdminTestimonials = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/testimonials');
      setList(data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await API.put(`/testimonials/${editId}`, form); toast.success('Updated!'); }
      else { await API.post('/testimonials', form); toast.success('Added!'); }
      setShowForm(false);
      fetchList();
    } catch { toast.error('Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await API.delete(`/testimonials/${id}`); toast.success('Deleted'); fetchList(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="admin-testimonials">
      <div className="page-header">
        <div>
          <h1>Testimonials</h1>
          <p>Manage customer reviews shown on the website</p>
        </div>
        <button className="add-btn" onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}>
          + Add Testimonial
        </button>
      </div>

      {loading ? <div className="admin-loading"><div className="spinner" /></div> : (
        <div className="testimonials-admin-grid">
          {list.map(t => (
            <div key={t._id} className="test-admin-card">
              <div className="tac-top">
                <div className="tac-avatar">{t.name[0]}</div>
                <div>
                  <div className="tac-name">{t.name}</div>
                  <div className="tac-loc">{t.location}</div>
                </div>
                <div className="tac-rating">{'⭐'.repeat(t.rating)}</div>
              </div>
              <p className="tac-msg">"{t.message}"</p>
              <div className="tac-foot">
                <span className="sac-category">{t.eventType}</span>
                <div className="sac-actions" style={{ paddingTop: 0, borderTop: 'none' }}>
                  <button onClick={() => { setForm(t); setEditId(t._id); setShowForm(true); }} className="edit-btn">✏️ Edit</button>
                  <button onClick={() => handleDelete(t._id)} className="del-btn">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="mf-row">
                <div className="mf-group">
                  <label>Customer Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="mf-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Jaipur" />
                </div>
              </div>
              <div className="mf-row">
                <div className="mf-group">
                  <label>Rating</label>
                  <select value={form.rating} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}>
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
                  </select>
                </div>
                <div className="mf-group">
                  <label>Event Type</label>
                  <select value={form.eventType} onChange={e => setForm(p => ({ ...p, eventType: e.target.value }))}>
                    {['wedding', 'baby-shower', 'birthday', 'anniversary', 'food', 'other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mf-group">
                <label>Review Message *</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} required />
              </div>
              <div className="mf-group check-group">
                <label><input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} /> Show on website</label>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                <button type="submit" disabled={saving} className="save-btn">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
