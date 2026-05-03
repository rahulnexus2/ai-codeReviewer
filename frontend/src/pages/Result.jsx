import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DiffEditor } from '@monaco-editor/react'
import api from '../services/api'

const ScoreCircle = ({ score }) => {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'text-[#22c55e]' : score >= 50 ? 'text-[#eab308]' : 'text-[#ef4444]'
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle className="text-[#21262d]" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="40" cy="40" />
        <circle 
          className={color} 
          strokeWidth="6" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="40" 
          cy="40" 
        />
      </svg>
      <span className="absolute text-xl font-bold text-white">{score || 0}</span>
    </div>
  )
}

const SeverityBadge = ({ type }) => {
  const styles = {
    error: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    warning: 'bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20',
    info: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20'
  }
  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${styles[type] || styles.info}`}>
      {type}
    </span>
  )
}

export default function Result() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResult()
  }, [id])

  const fetchResult = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/codereview/gethistory/${id}`)
      setData(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return <div className="text-center py-20 text-gray-400">Review not found.</div>
  }

  const { ai_feedback, original_code, model, created_at } = data

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* ── Top Section ── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="shrink-0">
          <ScoreCircle score={ai_feedback?.score || 0} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#21262d] text-gray-300 border border-[#30363d]">
              {model}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {new Date(created_at).toLocaleDateString()} at {new Date(created_at).toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Review Summary</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
            {ai_feedback?.summary}
          </p>
        </div>
        <div>
          <Link to="/history" className="text-sm text-[#3b82f6] hover:underline">
            &larr; Back to History
          </Link>
        </div>
      </div>

      {/* ── Middle Section: Diff View ── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden mb-6">
        <div className="flex bg-[#0d1117] border-b border-[#30363d]">
          <div className="flex-1 py-2 px-4 text-xs font-mono text-gray-400 border-r border-[#30363d]">Original Code</div>
          <div className="flex-1 py-2 px-4 text-xs font-mono text-gray-400">Optimized Code</div>
        </div>
        <div className="h-[500px]">
          <DiffEditor
            theme="vs-dark"
            original={original_code || ''}
            modified={ai_feedback?.optimizedCode || original_code || ''}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              renderSideBySide: true,
            }}
          />
        </div>
      </div>

      {/* ── Bottom Section: Issues Table ── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#30363d]">
          <h2 className="text-lg font-semibold text-white">Identified Issues</h2>
        </div>
        
        {ai_feedback?.issues?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0d1117] text-gray-400 text-xs uppercase border-b border-[#30363d]">
                <tr>
                  <th className="px-6 py-3 font-medium">Line</th>
                  <th className="px-6 py-3 font-medium">Severity</th>
                  <th className="px-6 py-3 font-medium">Issue</th>
                  <th className="px-6 py-3 font-medium">Suggestion</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {ai_feedback.issues.map((issue, idx) => (
                  <tr key={idx} className="hover:bg-[#21262d]/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">
                      {issue.line || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SeverityBadge type={issue.severity} />
                    </td>
                    <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={issue.description}>
                      {issue.description}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs max-w-sm truncate" title={issue.fix}>
                      {issue.fix}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigator.clipboard.writeText(issue.fix)}
                        className="text-[#3b82f6] hover:text-blue-400 text-xs font-medium bg-[#3b82f6]/10 px-3 py-1 rounded"
                      >
                        Copy Fix
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No issues found in this code!
          </div>
        )}
      </div>

    </div>
  )
}
