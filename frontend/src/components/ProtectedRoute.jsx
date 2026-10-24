import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Noch beim initialen Check – kurz warten
  if (loading) {
    return null;
  }

  // Nicht eingeloggt – zur Login-Seite
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Eingeloggt – zeig die geschützte Seite
  return children;
}

export default ProtectedRoute;