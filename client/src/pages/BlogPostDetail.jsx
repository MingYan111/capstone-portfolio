import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Loading from '../components/Loading';

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  const loadComments = async (postId) => {
    try {
      const { data } = await api.get(`/posts/${postId}/comments`);
      setComments(data.comments);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
        await loadComments(data.post._id);
      } catch (err) {
        setError(getErrorMessage(err, 'Post not found'));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg(null);
    try {
      await api.post(`/posts/${post._id}/comments`, {
        name: form.name,
        email: form.email,
        content: form.content,
      });
      setFormMsg({ type: 'success', text: 'Comment posted!' });
      setForm({ name: '', email: '', content: '' });
      await loadComments(post._id);
    } catch (err) {
      setFormMsg({ type: 'error', text: getErrorMessage(err, 'Failed to post comment') });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading post..." />;

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error" style={{ marginTop: 40 }}>
          {error}
        </div>
        <Link to="/blog" className="btn btn-outline btn-sm">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-head">
        <Link to="/blog" className="muted" style={{ display: 'block', marginBottom: 12 }}>
          ← Back to Blog
        </Link>
        <h1>{post.title}</h1>
        <div className="post-meta">
          {new Date(post.createdAt).toLocaleDateString()} · {post.author}
        </div>
        {post.tags?.length > 0 && (
          <div style={{ marginTop: 6 }}>
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 28 }}>
        <div className="post-content">{post.content}</div>
      </div>

      <section style={{ marginTop: 40 }}>
        <h2 className="section-title">Comments ({comments.length})</h2>

        {comments.length ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-head">
                <span className="comment-name">{comment.name}</span>
                <span className="muted">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        ) : (
          <p className="muted">No comments yet. Be the first to comment!</p>
        )}

        <form onSubmit={handleSubmit} className="form-card" style={{ marginTop: 24, maxWidth: '100%' }}>
          <h3 style={{ marginTop: 0 }}>Leave a Comment</h3>
          {formMsg && (
            <div className={`alert ${formMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {formMsg.text}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="c-name">Name *</label>
            <input
              id="c-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={80}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="c-content">Comment *</label>
            <textarea
              id="c-content"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              maxLength={1000}
              placeholder="Write your comment..."
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </section>
    </div>
  );
}
