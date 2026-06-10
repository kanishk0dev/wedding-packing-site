import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-mark">✦</div>
          <h1>Shringaar</h1>
          <p>Packing Studio</p>
        </div>
        <div className="login-tagline">
          <h2>Manage Your Studio</h2>
          <p>Full control over services, gallery, enquiries, and website content.</p>
        </div>
        <div className="login-features">
          {['📊 Dashboard & Analytics', '📬 Manage Enquiries', '🖼️ Gallery Management', '⚙️ Website Settings'].map(f => (
            <div key={f} className="login-feature">{f}</div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Super Admin Login</h2>
          <p>Enter your credentials to access the dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="admin@shringaar.com"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="login-hint">
            <strong>Default:</strong> admin@shringaar.com / Admin@123
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
