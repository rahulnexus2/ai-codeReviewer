import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await api.get('/codereview/gethistory')
      setHistory(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'

  const totalReviews = history.length
  const averageScore = totalReviews > 0 
    ? Math.round(history.reduce((acc, item) => acc + (item.ai_feedback?.score || 0), 0) / totalReviews)
    : 0

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* ── Header ── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 mb-6 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left shadow-lg">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#0d1117] shadow-xl shrink-0 bg-[#21262d] flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-gray-400">{getInitials(user?.name)}</span>
          )}
        </div>
        <div className="flex-1 mt-2">
          <h1 className="text-2xl font-bold text-white mb-1">{user?.name || 'Developer'}</h1>
          <p className="text-sm text-gray-400 mb-4">{user?.email}</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Reviews</p>
            <p className="text-3xl font-bold text-white">{totalReviews}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#3b82f6]"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Average Score</p>
            <p className="text-3xl font-bold text-white">{averageScore}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 flex items-center justify-center border border-[#22c55e]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#22c55e]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#30363d]">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-[#30363d]">
          {history.slice(0, 5).map(item => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#21262d]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center border ${
                    item.ai_feedback?.score >= 80 ? 'text-[#22c55e] border-[#22c55e]/30 bg-[#22c55e]/10' :
                    item.ai_feedback?.score >= 50 ? 'text-[#eab308] border-[#eab308]/30 bg-[#eab308]/10' :
                    'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10'
                  }`}
                >
                  {item.ai_feedback?.score || 0}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Reviewed code using {item.model}</p>
                  <p className="text-xs text-gray-500 font-mono">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
              <Link to={`/result/${item.id}`} className="text-sm text-[#3b82f6] hover:underline whitespace-nowrap">
                View &rarr;
              </Link>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No recent activity.
            </div>
          )}
        </div>
      </div>

    </div>
  )
}