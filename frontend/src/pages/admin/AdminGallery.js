import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './AdminServices.css';

const EMPTY_FORM = { title: '', description: '', category: '', isFeatured: false, order: 0, isActive: true };

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/gallery');
      setItems(data.data || []);
    } catch { toast.error('Failed to load gallery'); }
    setLoading(false);
  };

  useEffect(() => { fetchGallery(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setImageFile(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditId(item._id); setImageFile(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId && !imageFile) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editId) { await API.put(`/gallery/${editId}`, fd); toast.success('Updated!'); }
      else { await API.post('/gallery', fd); toast.success('Added to gallery!'); }
      setShowForm(false);
      fetchGallery();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try { await API.delete(`/gallery/${id}`); toast.success('Deleted'); fetchGallery(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleFeatured = async (id, isFeatured) => {
    try { await API.put(`/gallery/${id}`, { isFeatured: !isFeatured }); fetchGallery(); }
    catch {}
  };

  return (
    <div className="admin-gallery">
      <div className="page-header">
        <div>
          <h1>Gallery</h1>
          <p>Manage photos shown in the website gallery</p>
        </div>
        <button className="add-btn" onClick={openAdd}>+ Add Photos</button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="empty-gallery-admin">
          <div>🖼️</div>
          <h3>No Gallery Items</h3>
          <p>Click "Add Photos" to upload your first gallery image.</p>
          <button className="add-btn" onClick={openAdd}>+ Upload First Photo</button>
        </div>
      ) : (
        <div className="gallery-admin-grid">
          {items.map(item => (
            <div key={item._id} className={`gallery-admin-card ${!item.isActive ? 'inactive' : ''}`}>
              <div className="gac-img">
                <img src={`http://localhost:5000${item.image}`} alt={item.title} />
                {item.isFeatured && <span className="featured-ribbon">✦ Featured</span>}
              </div>
              <div className="gac-info">
                <h4>{item.title}</h4>
                {item.category && <span className="gac-cat">{item.category}</span>}
              </div>
              <div className="gac-actions">
                <button onClick={() => toggleFeatured(item._id, item.isFeatured)} className="toggle-btn">
                  {item.isFeatured ? '⭐ Unfeature' : '☆ Feature'}
                </button>
                <button onClick={() => openEdit(item)} className="edit-btn">✏️</button>
                <button onClick={() => handleDelete(item._id)} className="del-btn">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Photo' : 'Add New Photo'}</h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="mf-group">
                <label>Photo Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="mf-row">
                <div className="mf-group">
                  <label>Category</label>
                  <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. wedding" />
                </div>
                <div className="mf-group">
                  <label>Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
                </div>
              </div>
              <div className="mf-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
              </div>
              <div className="mf-group">
                <label>Image {!editId && '*'}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                {form.image && !imageFile && (
                  <img src={`http://localhost:5000${form.image}`} alt="" className="preview-img" />
                )}
              </div>
              <div className="mf-row">
                <div className="mf-group check-group">
                  <label><input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} /> Featured Photo</label>
                </div>
                <div className="mf-group check-group">
                  <label><input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} /> Active (visible)</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                <button type="submit" disabled={saving} className="save-btn">{saving ? 'Uploading...' : 'Save Photo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
