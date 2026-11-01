import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import Loading from '../components/Loading';

const TABS = ['projects', 'skills', 'posts', 'messages'];

export default function Admin() {
  const [tab, setTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // data per tab
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (tab === 'projects') {
          const { data } = await api.get('/projects');
          setProjects(data.projects);
        } else if (tab === 'skills') {
          const { data } = await api.get('/skills');
          setSkills(data.skills);
        } else if (tab === 'posts') {
          const { data } = await api.get('/posts?published=false');
          setPosts(data.posts);
        } else if (tab === 'messages') {
          const { data } = await api.get('/messages');
          setMessages(data.messages);
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load data'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab, refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);

  return (
    <div className="container">
      <div className="page-head">
        <h1>Admin Dashboard</h1>
        <p>Manage your portfolio projects, skills, blog posts and contact messages.</p>
      </div>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loading text={`Loading ${tab}...`} />
      ) : (
        <>
          {tab === 'projects' && (
            <ProjectsAdmin projects={projects} onChanged={reload} />
          )}
          {tab === 'skills' && <SkillsAdmin skills={skills} onChanged={reload} />}
          {tab === 'posts' && <PostsAdmin posts={posts} onChanged={reload} />}
          {tab === 'messages' && <MessagesAdmin messages={messages} onChanged={reload} />}
        </>
      )}
    </div>
  );
}

/* ================= Projects ================= */
function ProjectsAdmin({ projects, onChanged }) {
  const emptyForm = { title: '', description: '', image: '', link: '', github: '', technologies: '', featured: false };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      image: p.image || '',
      link: p.link || '',
      github: p.github || '',
      technologies: (p.technologies || []).join(', '),
      featured: p.featured,
    });
    setMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      link: form.link,
      github: form.github,
      technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
    };
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setMsg({ type: 'success', text: 'Project updated' });
      } else {
        await api.post('/projects', payload);
        setMsg({ type: 'success', text: 'Project created' });
      }
      reset();
      onChanged();
    } catch (err) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Failed to save project') });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      onChanged();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete project'));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingId ? 'Edit Project' : 'New Project'}</h3>
        {msg && <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
        <div className="form-group">
          <label>Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={120} />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>Live Link</label>
          <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>GitHub Link</label>
          <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>Technologies (comma separated)</label>
          <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: 'auto' }} />
            Featured project (shown on homepage)
          </label>
        </div>
        <div className="form-inline">
          <button type="submit" className="btn btn-primary btn-sm">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" className="btn btn-outline btn-sm" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      {projects.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tech</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{(p.technologies || []).slice(0, 3).join(', ')}</td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty"><p>No projects yet.</p></div>
      )}
    </div>
  );
}

/* ================= Skills ================= */
function SkillsAdmin({ skills, onChanged }) {
  const emptyForm = { name: '', category: '', level: 50, icon: '' };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({ name: s.name, category: s.category || '', level: s.level, icon: s.icon || '' });
    setMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const payload = { name: form.name, category: form.category, level: Number(form.level), icon: form.icon };
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, payload);
        setMsg({ type: 'success', text: 'Skill updated' });
      } else {
        await api.post('/skills', payload);
        setMsg({ type: 'success', text: 'Skill created' });
      }
      reset();
      onChanged();
    } catch (err) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Failed to save skill') });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      onChanged();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete skill'));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingId ? 'Edit Skill' : 'New Skill'}</h3>
        {msg && <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
        <div className="form-group">
          <label>Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={60} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Front-End / Back-End / Languages..." />
        </div>
        <div className="form-group">
          <label>Level (1-100)</label>
          <input type="number" min={1} max={100} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
        </div>
        <div className="form-inline">
          <button type="submit" className="btn btn-primary btn-sm">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" className="btn btn-outline btn-sm" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      {skills.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.category}</td>
                  <td>{s.level}%</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty"><p>No skills yet.</p></div>
      )}
    </div>
  );
}

/* ================= Posts ================= */
function PostsAdmin({ posts, onChanged }) {
  const emptyForm = { title: '', excerpt: '', content: '', tags: '', cover: '', published: true };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      excerpt: p.excerpt || '',
      content: p.content,
      tags: (p.tags || []).join(', '),
      cover: p.cover || '',
      published: p.published,
    });
    setMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      cover: form.cover,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      published: form.published,
    };
    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, payload);
        setMsg({ type: 'success', text: 'Post updated' });
      } else {
        await api.post('/posts', payload);
        setMsg({ type: 'success', text: 'Post created' });
      }
      reset();
      onChanged();
    } catch (err) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Failed to save post') });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This will also remove its comments.')) return;
    try {
      await api.delete(`/posts/${id}`);
      onChanged();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete post'));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingId ? 'Edit Post' : 'New Post'}</h3>
        {msg && <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
        <div className="form-group">
          <label>Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={160} />
        </div>
        <div className="form-group">
          <label>Excerpt</label>
          <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} maxLength={300} placeholder="Short summary shown in the blog list" />
        </div>
        <div className="form-group">
          <label>Content *</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required style={{ minHeight: 220 }} placeholder="Write your post content here..." />
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Full-Stack, React, MongoDB" />
        </div>
        <div className="form-group">
          <label>Cover Image URL</label>
          <input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: 'auto' }} />
            Published
          </label>
        </div>
        <div className="form-inline">
          <button type="submit" className="btn btn-primary btn-sm">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" className="btn btn-outline btn-sm" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      {posts.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Published</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.published ? 'Yes' : 'Draft'}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty"><p>No posts yet.</p></div>
      )}
    </div>
  );
}

/* ================= Messages ================= */
function MessagesAdmin({ messages, onChanged }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      onChanged();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete message'));
    }
  };

  if (!messages.length) {
    return <div className="empty"><p>No messages received yet.</p></div>;
  }

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.subject || '—'}</td>
              <td style={{ maxWidth: 320 }}>{m.message.slice(0, 80)}{m.message.length > 80 ? '...' : ''}</td>
              <td>{new Date(m.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="admin-row-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
