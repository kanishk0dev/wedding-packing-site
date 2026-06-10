import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './AdminEnquiries.css';

const STATUS_OPTIONS = ['new', 'contacted', 'in-progress', 'completed', 'cancelled'];

const STATUS_STYLE = {
  new: { bg: '#E8F4FF', color: '#1A6EBD' },
  contacted: { bg: '#FFF8E6', color: '#B07800' },
  'in-progress': { bg: '#F0F8FF', color: '#0066AA' },
  completed: { bg: '#E8F8F0', color: '#1A8A50' },
  cancelled: { bg: '#FFF0F0', color: '#CC3333' },
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filter) params.append('status', filter);
      const { data } = await API.get(`/enquiries?${params}`);
      setEnquiries(data.data || []);
      setPagination(data.pagination || {});
    } catch (e) { toast.error('Failed to load enquiries'); }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(true);
    try {
      await API.put(`/enquiries/${id}`, { status });
      toast.success('Status updated');
      fetchEnquiries();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error('Update failed'); }
    setUpdating(false);
  };

  const handleNotesSave = async () => {
    try {
      await API.put(`/enquiries/${selected._id}`, { adminNotes: selected.adminNotes });
      toast.success('Notes saved');
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await API.delete(`/enquiries/${id}`);
      toast.success('Deleted');
      setSelected(null);
      fetchEnquiries();
    } catch { toast.error('Delete failed'); }
  };

  const openDetail = async (enq) => {
    setSelected(enq);
    if (!enq.isRead) {
      try { await API.get(`/enquiries/${enq._id}`); fetchEnquiries(); }
      catch {}
    }
  };

  return (
    <div className="admin-enquiries">
      <div className="page-header">
        <div>
          <h1>Enquiries</h1>
          <p>Manage all customer enquiries from here</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <button className={`filter-chip ${!filter ? 'active' : ''}`} onClick={() => { setFilter(''); setPage(1); }}>
          All
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} className={`filter-chip ${filter === s ? 'active' : ''}`}
            onClick={() => { setFilter(s); setPage(1); }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="enquiries-layout">
        {/* LIST */}
        <div className="enq-list">
          {loading ? (
            <div className="list-loading"><div className="spinner" /></div>
          ) : enquiries.length === 0 ? (
            <div className="empty-list">📭 No enquiries found</div>
          ) : (
            enquiries.map(enq => (
              <div
                key={enq._id}
                className={`enq-list-item ${selected?._id === enq._id ? 'selected' : ''} ${!enq.isRead ? 'unread' : ''}`}
                onClick={() => openDetail(enq)}
              >
                <div className="eli-top">
                  <div className="eli-name">
                    {!enq.isRead && <span className="new-dot" />}
                    {enq.name}
                  </div>
                  <span className="eli-status"
                    style={{ background: STATUS_STYLE[enq.status]?.bg, color: STATUS_STYLE[enq.status]?.color }}>
                    {enq.status}
                  </span>
                </div>
                <div className="eli-meta">
                  <span>📞 {enq.phone}</span>
                  <span>🎉 {enq.eventType}</span>
                </div>
                <div className="eli-date">{new Date(enq.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            ))
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span>{page} / {pagination.pages}</span>
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>

        {/* DETAIL */}
        {selected ? (
          <div className="enq-detail">
            <div className="detail-header">
              <h2>{selected.name}</h2>
              <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="detail-status-bar">
              <span>Status:</span>
              <select
                value={selected.status}
                onChange={e => handleStatusUpdate(selected._id, e.target.value)}
                disabled={updating}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="delete-btn" onClick={() => handleDelete(selected._id)}>🗑 Delete</button>
            </div>

            <div className="detail-grid">
              <div className="detail-field"><label>Phone</label><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
              <div className="detail-field"><label>Email</label><a href={`mailto:${selected.email}`}>{selected.email || '—'}</a></div>
              <div className="detail-field"><label>City</label><span>{selected.city || '—'}</span></div>
              <div className="detail-field"><label>Event Type</label><span className="event-tag">{selected.eventType}</span></div>
              <div className="detail-field"><label>Event Date</label>
                <span>{selected.eventDate ? new Date(selected.eventDate).toLocaleDateString('en-IN') : '—'}</span>
              </div>
              <div className="detail-field"><label>Budget</label><span>{selected.budget || '—'}</span></div>
            </div>

            {selected.services?.length > 0 && (
              <div className="detail-services">
                <label>Services Requested:</label>
                <div className="service-tags">
                  {selected.services.map((s, i) => <span key={i} className="service-tag">{s}</span>)}
                </div>
              </div>
            )}

            <div className="detail-message">
              <label>Customer Message:</label>
              <div className="message-box">{selected.message}</div>
            </div>

            <div className="detail-notes">
              <label>Admin Notes:</label>
              <textarea
                value={selected.adminNotes || ''}
                onChange={e => setSelected(prev => ({ ...prev, adminNotes: e.target.value }))}
                placeholder="Add your internal notes here..."
                rows={4}
              />
              <button className="save-notes-btn" onClick={handleNotesSave}>Save Notes</button>
            </div>

            <div className="detail-actions">
              <a href={`tel:${selected.phone}`} className="action-btn call-btn">📞 Call Now</a>
              {selected.phone && (
                <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                  target="_blank" rel="noreferrer" className="action-btn whatsapp-btn">
                  💬 WhatsApp
                </a>
              )}
              {selected.email && (
                <a href={`mailto:${selected.email}`} className="action-btn email-btn">✉️ Email</a>
              )}
            </div>
          </div>
        ) : (
          <div className="enq-detail-empty">
            <div>📬</div>
            <p>Select an enquiry to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;
