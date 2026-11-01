import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Loading from '../components/Loading';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data.posts);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load posts'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading text="Loading blog..." />;

  return (
    <div className="container">
      <div className="page-head">
        <h1>Blog</h1>
        <p>Thoughts on full-stack development, databases and my learning journey.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {posts.length ? (
        <div className="grid grid-2">
          {posts.map((post) => (
            <article key={post._id} className="card post-card">
              <h3>
                <Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link>
              </h3>
              <div className="post-meta">
                {new Date(post.createdAt).toLocaleDateString()} · {post.author}
              </div>
              <p className="muted" style={{ margin: 0 }}>
                {post.excerpt || `${post.content.slice(0, 140)}...`}
              </p>
              {post.tags?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>No posts published yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
