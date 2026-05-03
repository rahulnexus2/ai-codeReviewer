import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';

const AuthLayout = () => {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e2e8f0] relative overflow-x-hidden font-sans">
      <AuthProvider>
        <div className="relative z-10 flex flex-col min-h-screen">
          {!isLogin && <Navbar />}
          <main className="flex-1 w-full relative">
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </div>
  );
};

export default AuthLayout;