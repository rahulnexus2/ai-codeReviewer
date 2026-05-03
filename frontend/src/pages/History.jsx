import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? 'text-[#22c55e] border-[#22c55e]/30 bg-[#22c55e]/10' 
              : score >= 50 ? 'text-[#eab308] border-[#eab308]/30 bg-[#eab308]/10' 
              : 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10'
  
  return (
    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border ${color}`}>
      <span className="text-[10px] font-semibold tracking-wider opacity-75 leading-none mb-0.5">SCORE</span>
      <span className="text-sm font-bold leading-none">{score || 0}</span>
    </div>
  )
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await api.get('/codereview/gethistory')
      setHistory(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm("Delete this review?")) return
    try {
      await api.delete(`/codereview/history/delete/${id}`)
      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Review History</h1>
        <span className="text-sm text-gray-500 bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">
          {history.length} Total Reviews
        </span>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#161b22] border border-[#30363d] rounded-lg border-dashed">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-600 mb-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <h2 className="text-white font-medium mb-1">No history yet</h2>
          <p className="text-sm text-gray-500 mb-6">You haven't reviewed any code.</p>
          <Link to="/home" className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Review Code
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => (
            <div key={item.id} className="group flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden hover:border-[#8b949e] transition-colors relative">
              
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <ScoreBadge score={item.ai_feedback?.score || 0} />
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#21262d] text-gray-300 border border-[#30363d] mb-1">
                      {item.model}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed mb-4">
                  {item.ai_feedback?.summary || 'No summary provided.'}
                </p>

                <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                  <p className="text-xs text-gray-500 font-mono truncate">
                    {item.original_code?.split('\n')[0]?.trim() || "..."}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
                <button 
                  onClick={(e) => handleDelete(item.id, e)}
                  className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
                >
                  Delete
                </button>
                <Link 
                  to={`/result/${item.id}`}
                  className="text-xs text-[#3b82f6] hover:text-blue-400 font-medium flex items-center gap-1 group-hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
