import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';

/**
 * The AuthLayout wraps all routes that need access to the AuthContext.
 * Because it is rendered inside the RouterProvider, 
 * the useAuth hook (and its useNavigate call) will work correctly.
 */
const AuthLayout = () => {
  return (
    <AuthProvider>
      {/* Outlet renders the child routes defined in your router (Login, Home, etc.) */}
      <Outlet />
    </AuthProvider>
  );
};

export default AuthLayout;