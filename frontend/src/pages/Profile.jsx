import React, { useState, useEffect } from 'react'
import api from '../services/api'

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [user, setUser]       = useState(null)
  const [visible, setVisible] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {        
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('user/profile')  
        setUser(res.data.user)                      
        setTimeout(() => setVisible(true), 50)
      } catch (err) {
        setError(err.message || 'Failed to load profile')  
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleLogout = async () => {
    try {
      await api.post('auth/logout')
      window.location.href = '/login'
    } catch (err) {
      setError('Logout failed. Try again.')
    }
  }

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-18px) scale(1.06)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,22px) scale(0.96)} }
        @keyframes float-c { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(15px,12px) scale(1.04)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.5);opacity:0} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes avatar-in { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }

        .blob-a { animation: float-a 14s ease-in-out infinite; }
        .blob-b { animation: float-b 17s ease-in-out infinite; }
        .blob-c { animation: float-c 11s ease-in-out infinite; }

        .card-enter { animation: slide-up 0.6s cubic-bezier(.22,1,.36,1) both; }
        .d1{animation-delay:0.05s} .d2{animation-delay:0.13s}
        .d3{animation-delay:0.21s} .d4{animation-delay:0.29s} .d5{animation-delay:0.37s}

        .avatar-enter { animation: avatar-in 0.5s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .ping-dot { animation: ping 1.5s ease-in-out infinite; }

        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        .stat-card { transition: transform 0.2s ease; }
        .stat-card:hover { transform: translateY(-2px); }

        .logout-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .logout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(239,68,68,0.2); }
        .logout-btn:active { transform: translateY(0); }

        .noise::after {
          content:'';position:absolute;inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none;border-radius:inherit;
        }
      `}</style>

      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob-a absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl bg-violet-700/20" />
        <div className="blob-b absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl bg-blue-700/18" />
        <div className="blob-c absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl bg-indigo-900/15" />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage:'radial-gradient(circle, #818cf8 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
      </div>

      {/* Card */}
      <div className={`noise relative z-10 w-full max-w-md ${visible ? 'card-enter' : 'opacity-0'}`}>
        <div className="relative rounded-2xl border border-white/[0.09] backdrop-blur-xl bg-white/[0.04] shadow-2xl shadow-black/50 px-8 py-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {/* Logo row */}
          <div className="card-enter d1 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 8L3 12L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L21 12L17 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 4L10 20" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-white font-bold text-[15px] tracking-tight">
                Code<span className="text-violet-400">Review</span>.ai
              </span>
            </div>
            <span className="text-[11px] text-slate-500 bg-white/5 border border-white/8 rounded-full px-3 py-1">
              Profile
            </span>
          </div>

          {loading ? (
            /* Skeleton loader */
            <div>
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="shimmer w-22 h-22 rounded-full" style={{ width:'88px', height:'88px' }} />
                <div className="flex flex-col items-center gap-2">
                  <div className="shimmer w-40 h-5" />
                  <div className="shimmer w-52 h-3.5" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1,2,3].map(i => <div key={i} className="shimmer h-18 rounded-xl" style={{ height:'72px' }} />)}
              </div>
              <div className="shimmer h-12 rounded-xl" />
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-red-400 text-sm mb-4">⚠ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-violet-400 text-sm border border-violet-400/30 rounded-lg px-4 py-2 hover:bg-violet-400/10 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : user ? (
            <>
              {/* Avatar + Name + Email */}
              <div className="card-enter d2 flex flex-col items-center gap-4 mb-8">
                <div className="avatar-enter relative">
                  <div className="p-0.5 rounded-full bg-gradient-to-br from-violet-600 to-blue-600"
                    style={{ boxShadow:'0 0 0 4px rgba(139,92,246,0.15)' }}>
                    {user.avatar && !imgError ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        onError={() => setImgError(true)}
                        className="w-20 h-20 rounded-full object-cover block"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-900 to-blue-900 flex items-center justify-center text-2xl font-bold text-white">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>
                  {/* online dot */}
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-gray-950 flex items-center justify-center">
                    <span className="ping-dot absolute w-full h-full rounded-full bg-emerald-400" />
                  </span>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                  <span className="inline-block mt-2.5 text-[11px] font-semibold text-violet-400 bg-violet-500/12 border border-violet-500/25 rounded-full px-3 py-1">
                    ✦ Pro Plan
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="card-enter d3 grid grid-cols-3 gap-2.5 mb-6">
                {[
                  { val: user.reviews_count ?? '—', lbl: 'Reviews' },
                  { val: user.joined?.split(' ')[1] ?? '2026', lbl: 'Since' },
                  { val: '6+', lbl: 'Languages' },
                ].map(s => (
                  <div key={s.lbl} className="stat-card rounded-xl border border-white/8 bg-white/4 p-3 text-center cursor-default">
                    <p className="text-sm font-bold text-white">{s.val}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.lbl}</p>
                  </div>
                ))}
              </div>

              {/* Info rows */}
              <div className="card-enter d4 rounded-xl border border-white/7 bg-white/[0.03] overflow-hidden mb-6">
                {[
                  { icon:'👤', label:'Name',   value: user.name },
                  { icon:'✉️', label:'Email',  value: user.email },
                  { icon:'📅', label:'Joined', value: user.joined ?? 'January 2026' },
                ].map((row, i, arr) => (
                  <div key={row.label} className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length-1 ? 'border-b border-white/[0.06]' : ''}`}>
                    <span className="text-sm flex-shrink-0">{row.icon}</span>
                    <span className="text-xs text-slate-500 w-14 flex-shrink-0">{row.label}</span>
                    <span className="text-sm text-gray-200 font-medium truncate">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Logout */}
              <div className="card-enter d5">
                <button
                  onClick={handleLogout}
                  className="logout-btn w-full flex items-center justify-center gap-2 bg-red-500/8 border border-red-500/20 text-red-400 font-semibold text-sm py-3 rounded-xl cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          ) : null}

        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-6 flex items-center gap-4 text-xs text-slate-600 card-enter">
        <a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a>
        <span>·</span>
        <a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a>
        <span>·</span>
        <span>© 2026 CodeReview.ai</span>
      </div>
    </div>
  )
}

export default Profile