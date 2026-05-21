import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return children ? children : <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
