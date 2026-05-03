import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';


const AuthLayout = () => {
  return (
    <AuthProvider>
      <Navbar> </Navbar>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthLayout;