import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards a route: requires an authenticated user. If adminOnly is set,
 * the user must also have the admin flag.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
