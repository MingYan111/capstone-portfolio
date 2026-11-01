import { useState } from 'react';
import api, { getErrorMessage } from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      await api.post('/messages', form);
      setResult({ type: 'success', text: 'Message sent successfully! I will get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setResult({ type: 'error', text: getErrorMessage(err, 'Failed to send message') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-head">
        <h1>Contact Me</h1>
        <p>Have a question or want to work together? Send me a message.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 560 }}>
        {result && (
          <div className={`alert ${result.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {result.text}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="msg-name">Name *</label>
          <input
            id="msg-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={80}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="msg-email">Email *</label>
          <input
            id="msg-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="msg-subject">Subject</label>
          <input
            id="msg-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            maxLength={160}
            placeholder="What is this about?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="msg-message">Message *</label>
          <textarea
            id="msg-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            maxLength={2000}
            placeholder="Write your message..."
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
