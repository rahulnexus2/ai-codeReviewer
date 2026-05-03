import React, { useState } from 'react'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      
      <div className="w-full max-w-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">CodeReview.ai</h1>
          <p className="text-gray-400 text-center text-sm">AI Powered Code Review for Developers</p>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 shadow-xl">
          
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-3">
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-sm px-4 py-2.5 rounded-md border border-[rgba(240,246,252,0.1)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <GoogleSVG />
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
          
        </div>

      </div>
    </div>
  )
}

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="bg-white rounded-full p-[1px]">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 13.079 17.64 11.273 17.64 9.205z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

export default Login