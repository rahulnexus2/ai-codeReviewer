import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'

const NotFound = () => {
  const { dark: d } = useContext(ThemeContext)

  return (
    <div className={`flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 relative z-10 ${d ? 'text-slate-200' : 'text-slate-800'}`}>
      <div className={`relative rounded-2xl border backdrop-blur-xl px-12 py-16 text-center shadow-2xl ${d ? 'bg-gray-900/60 border-gray-800 shadow-black/50' : 'bg-white/60 border-slate-300 shadow-slate-200'}`}>
        
        {/* inner top glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px ${d ? 'bg-gradient-to-r from-transparent via-violet-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-violet-300/60 to-transparent'}`} />

        <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent tracking-tight mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className={`mb-8 ${d ? 'text-slate-400' : 'text-slate-500'}`}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/home"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
