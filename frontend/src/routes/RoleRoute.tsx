import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ requiredRole }: { requiredRole: string }) {
  const { isAuthenticated, user, primaryRole } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in but wrong role → redirect to their actual dashboard
  const hasRole = user?.roles?.includes(requiredRole);

  if (!hasRole) {
    // Redirect to the appropriate dashboard based on their actual role
    if (primaryRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (primaryRole === 'VENDOR') return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
