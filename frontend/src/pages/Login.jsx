import React, { useState, useEffect } from 'react'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [dark, setDark]       = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cr-theme')
    if (saved) setDark(saved === 'dark')
    setTimeout(() => setVisible(true), 50)
  }, [])

  const toggleTheme = () =>
    setDark(prev => {
      localStorage.setItem('cr-theme', !prev ? 'dark' : 'light')
      return !prev
    })

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      window.location.href = 'http://localhost:8000/auth/google'
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const d = dark

  return (
    <div className={`${d ? 'bg-gray-950' : 'bg-slate-100'} min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-500`}>

      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-18px) scale(1.06)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,22px) scale(0.96)} }
        @keyframes float-c { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(15px,12px) scale(1.04)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes code-scroll { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }

        .blob-a { animation: float-a 14s ease-in-out infinite; }
        .blob-b { animation: float-b 17s ease-in-out infinite; }
        .blob-c { animation: float-c 11s ease-in-out infinite; }
        .spinner { animation: spin 0.7s linear infinite; }

        .card-enter { animation: slide-up 0.6s cubic-bezier(.22,1,.36,1) both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.13s; }
        .d3 { animation-delay: 0.21s; }
        .d4 { animation-delay: 0.29s; }
        .d5 { animation-delay: 0.37s; }
        .d6 { animation-delay: 0.45s; }

        .google-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .google-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.25); }
        .google-btn:active:not(:disabled) { transform: translateY(0px); }

        .code-ticker { animation: code-scroll 18s linear infinite; }

        .noise::after {
          content:'';position:absolute;inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none;border-radius:inherit;
        }
      `}</style>

      {/* ── Animated background blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`blob-a absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${d ? 'bg-violet-700/20' : 'bg-violet-300/35'}`} />
        <div className={`blob-b absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl ${d ? 'bg-blue-700/18' : 'bg-blue-300/30'}`} />
        <div className={`blob-c absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl ${d ? 'bg-indigo-900/15' : 'bg-indigo-100/60'}`} />

        {/* dot grid */}
        <div className={`absolute inset-0 opacity-[0.035]`}
          style={{ backgroundImage:'radial-gradient(circle, #818cf8 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
      </div>

      {/* ── Dark / Light toggle ── */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200 ${d ? 'bg-white/8 hover:bg-white/14 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'}`}
          aria-label="Toggle theme"
        >
          {d ? '☀️' : '🌙'}
        </button>
      </div>

      {/* ── Main card ── */}
      <div className={`relative z-10 w-full max-w-md noise ${visible ? 'card-enter' : 'opacity-0'}`}>
        <div className={`relative rounded-2xl border backdrop-blur-xl px-8 py-10 ${d ? 'bg-white/[0.04] border-white/[0.09] shadow-2xl shadow-black/50' : 'bg-white/75 border-white shadow-xl shadow-slate-200'}`}>

          {/* inner top glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px ${d ? 'bg-gradient-to-r from-transparent via-violet-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-violet-300/60 to-transparent'}`} />

          {/* ── Logo + title ── */}
          <div className="card-enter d1 flex flex-col items-center gap-4 mb-8">
            {/* logo */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M7 8L3 12L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L21 12L17 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 4L10 20" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              {/* status dot */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-gray-950 flex items-center justify-center">
                <span className="w-full h-full rounded-full bg-emerald-400 animate-ping absolute opacity-70" />
              </span>
            </div>

            <div className="text-center">
              <h1 className={`text-xl font-bold tracking-tight ${d ? 'text-white' : 'text-slate-900'}`}>
                Code<span className="text-violet-400">Review</span>.ai
              </h1>
              <p className={`text-sm mt-1 ${d ? 'text-slate-500' : 'text-slate-400'}`}>
                AI-powered code reviews in seconds
              </p>
            </div>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div className={`card-enter mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${d ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">✕</button>
            </div>
          )}

          {/* ── Feature pills ── */}
          <div className="card-enter d2 flex flex-wrap justify-center gap-2 mb-7">
            {['Bug detection', 'Best practices', 'Auto-fix'].map(f => (
              <span key={f} className={`text-xs px-3 py-1 rounded-full border font-medium ${d ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                {f}
              </span>
            ))}
          </div>

          {/* ── Google button ── */}
          <div className="card-enter d3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="google-btn w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-semibold text-sm px-5 py-3.5 rounded-xl border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="spinner w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full" />
                  <span>Signing you in…</span>
                </>
              ) : (
                <>
                  <GoogleSVG />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* ── Divider ── */}
          <div className="card-enter d4 flex items-center gap-3 my-6">
            <div className={`flex-1 h-px ${d ? 'bg-white/8' : 'bg-slate-200'}`} />
            <span className={`text-xs font-medium ${d ? 'text-slate-600' : 'text-slate-400'}`}>Your code stays private</span>
            <div className={`flex-1 h-px ${d ? 'bg-white/8' : 'bg-slate-200'}`} />
          </div>

          {/* ── Stats ── */}
          <div className="card-enter d5 grid grid-cols-3 gap-3 mb-8">
            {[
              { val: '6+',     lbl: 'Languages'  },
              { val: '< 5s',   lbl: 'Avg review' },
              { val: 'Gemini', lbl: 'AI model'   },
            ].map(s => (
              <div key={s.lbl} className={`rounded-xl border p-3 text-center ${d ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm font-bold ${d ? 'text-white' : 'text-slate-800'}`}>{s.val}</p>
                <p className={`text-xs mt-0.5 ${d ? 'text-slate-500' : 'text-slate-400'}`}>{s.lbl}</p>
              </div>
            ))}
          </div>

          {/* ── Code ticker ── */}
          <div className="card-enter d6">
            <div className={`rounded-xl border overflow-hidden ${d ? 'bg-gray-900/70 border-white/6' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`flex items-center gap-1.5 px-4 py-2 border-b ${d ? 'border-white/6' : 'border-slate-200'}`}>
                <span className="w-2 h-2 rounded-full bg-red-400/70" />
                <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
                <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
                <span className={`ml-2 text-[10px] font-mono ${d ? 'text-slate-600' : 'text-slate-400'}`}>review.js</span>
              </div>
              <div className="h-16 overflow-hidden relative">
                <div className="code-ticker font-mono text-[11px] leading-6 px-4 py-2 space-y-0.5">
                  {[
                    <><span className="text-purple-400">const</span> <span className="text-blue-300">result</span> <span className="text-slate-500">=</span> <span className="text-yellow-300">await</span> <span className="text-blue-300">ai</span><span className="text-slate-500">.review(</span><span className="text-green-300">code</span><span className="text-slate-500">)</span></>,
                    <><span className="text-slate-500">{'// ✓ found 3 issues, 1 critical'}</span></>,
                    <><span className="text-blue-300">result</span><span className="text-slate-500">.</span><span className="text-yellow-300">autoFix</span><span className="text-slate-500">()</span></>,
                    <><span className="text-emerald-400">{'// ✓ all issues resolved'}</span></>,
                    <><span className="text-purple-400">const</span> <span className="text-blue-300">result</span> <span className="text-slate-500">=</span> <span className="text-yellow-300">await</span> <span className="text-blue-300">ai</span><span className="text-slate-500">.review(</span><span className="text-green-300">code</span><span className="text-slate-500">)</span></>,
                    <><span className="text-slate-500">{'// ✓ found 3 issues, 1 critical'}</span></>,
                    <><span className="text-blue-300">result</span><span className="text-slate-500">.</span><span className="text-yellow-300">autoFix</span><span className="text-slate-500">()</span></>,
                    <><span className="text-emerald-400">{'// ✓ all issues resolved'}</span></>,
                  ].map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                {/* fade masks */}
                <div className={`absolute top-0 inset-x-0 h-4 ${d ? 'bg-gradient-to-b from-gray-900/70' : 'bg-gradient-to-b from-slate-50'}`} />
                <div className={`absolute bottom-0 inset-x-0 h-4 ${d ? 'bg-gradient-to-t from-gray-900/70' : 'bg-gradient-to-t from-slate-50'}`} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div className={`relative z-10 mt-6 flex items-center gap-4 text-xs card-enter ${d ? 'text-slate-600' : 'text-slate-400'}`}>
        <a href="#" className={`transition-colors ${d ? 'hover:text-violet-400' : 'hover:text-violet-600'}`}>Privacy Policy</a>
        <span>·</span>
        <a href="#" className={`transition-colors ${d ? 'hover:text-violet-400' : 'hover:text-violet-600'}`}>Terms of Service</a>
        <span>·</span>
        <span>© 2026 CodeReview.ai</span>
      </div>

    </div>
  )
}

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 13.079 17.64 11.273 17.64 9.205z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

export default Login