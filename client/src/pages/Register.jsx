import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const res = await register(form.username, form.email, form.password, form.name);
    setLoading(false);
    if (res.ok) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <form onSubmit={handleSubmit} className="form-card">
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Register</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="reg-name">Name</label>
          <input
            id="reg-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your display name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-username">Username *</label>
          <input
            id="reg-username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={30}
            placeholder="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email *</label>
          <input
            id="reg-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password *</label>
          <input
            id="reg-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
