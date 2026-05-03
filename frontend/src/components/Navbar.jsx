import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ user }) => {
  const { pathname } = useLocation()

  const links = [
    {
      to: '/profile',
      label: 'Profile',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      to: '/history',
      label: 'History',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
  ]

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'

  return (
    <>
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping-dot {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50%      { transform: scale(1.8); opacity: 0; }
        }
        .navbar    { animation: slide-down 0.5s cubic-bezier(.22,1,.36,1) both; }
        .ping-anim { animation: ping-dot 1.8s ease-in-out infinite; }
        .nav-link  { transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; }
      `}</style>

      <nav className="navbar sticky top-0 z-50 w-full border-b border-white/[0.07] backdrop-blur-xl bg-white/[0.04]">

        {/* top glow line — same as login/profile cards */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/home" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M7 8L3 12L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L21 12L17 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 4L10 20" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-[15px] tracking-tight">
              Code<span className="text-violet-400">Review</span>.ai
            </span>
          </Link>

          {/* ── Nav links ── */}
          <div className="flex items-center gap-1.5">
            {links.map(({ to, label, icon }) => {
              const active = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`nav-link flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[13px] font-medium no-underline
                    ${active
                      ? 'text-violet-400 bg-violet-500/10 border-violet-500/20'
                      : 'text-slate-500 border-transparent hover:text-violet-400 hover:bg-violet-500/8'
                    }`}
                >
                  {icon}
                  {label}
                </Link>
              )
            })}
          </div>

          {/* ── Avatar ── */}
          <div className="relative flex-shrink-0 cursor-pointer">
            <div
              className="p-[1.5px] rounded-full bg-gradient-to-br from-violet-600 to-blue-600"
              style={{ boxShadow: '0 0 0 3px rgba(139,92,246,0.15)' }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-[34px] h-[34px] rounded-full object-cover block"
                />
              ) : (
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-violet-900 to-blue-900 flex items-center justify-center text-[12px] font-bold text-white">
                  {getInitials(user?.name)}
                </div>
              )}
            </div>

            {/* online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-gray-950 flex items-center justify-center">
              <span className="ping-anim absolute w-full h-full rounded-full bg-emerald-400" />
            </span>
          </div>

        </div>
      </nav>
    </>
  )
}

export default Navbar