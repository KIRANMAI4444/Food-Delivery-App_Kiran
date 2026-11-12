import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking localStorage for the token, show a loading state
  if (loading) return <div className="text-center mt-10">Checking authentication...</div>;

  // If no user is logged in, bounce them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, show the page they requested
  return children;
};

export default ProtectedRoute;