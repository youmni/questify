import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" />;

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/not-found" />;
  }

  return <Outlet />;
};

export default PrivateRoute;