import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty" style={{ paddingTop: 120 }}>
        <h1 style={{ fontSize: 64, margin: 0, color: 'var(--accent)' }}>404</h1>
        <p>Oops! The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
