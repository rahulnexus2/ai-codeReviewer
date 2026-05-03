import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { pathname } = useLocation()
  const { user, Logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const links = [
    { to: '/home', label: 'Home' },
    { to: '/history', label: 'History' },
    { to: '/profile', label: 'Profile' },
  ]

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#30363d] bg-[#0d1117]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Left side: Logo + Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 no-underline text-white font-bold tracking-tight text-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            CodeReview<span className="text-blue-500">.ai</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => {
              const active = pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active 
                      ? 'text-white bg-[#161b22]' 
                      : 'text-gray-400 hover:text-white hover:bg-[#161b22]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right side: Avatar dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-white font-bold">{getInitials(user?.name)}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#161b22] border border-[#30363d] py-1 z-50">
              <div className="px-4 py-2 border-b border-[#30363d] mb-1">
                <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
              </div>
              <Link 
                to="/profile" 
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#30363d] hover:text-white"
              >
                Your Profile
              </Link>
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  Logout();
                }}
                className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-[#30363d] hover:text-red-300"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar