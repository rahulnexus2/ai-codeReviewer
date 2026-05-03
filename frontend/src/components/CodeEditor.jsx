import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import api from '../services/api'

const AI_MODELS = [
  { value: 'hugging-face', label: 'Llama 3.1' },
  { value: 'gemini', label: 'Gemini Flash' },
  { value: 'groq', label: 'Groq Beta' },
]

const ScoreCircle = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  
  const color = animatedScore >= 80 ? 'text-[#22c55e]' : animatedScore >= 50 ? 'text-[#eab308]' : 'text-[#ef4444]'
  
  return (
    <div className="relative inline-flex items-center justify-center my-4">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle className="text-[#21262d]" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="56" cy="56" />
        <circle 
          className={`${color} transition-all duration-1000 ease-out`} 
          strokeWidth="8" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="56" 
          cy="56" 
        />
      </svg>
      <span className="absolute text-3xl font-bold text-white">{animatedScore}</span>
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

export default function CodeEditor() {
  const [value, setValue] = useState('// Paste your code here...')
  const [model, setModel] = useState('gemini')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedIssue, setExpandedIssue] = useState(null)

  const handleSubmit = async () => {
    if (!value?.trim()) return
    setLoading(true)
    setError(null)
    setOutput(null)
    try {
      const res = await api.post('/code/review', { model, original_code: value }, { timeout: 60000 })
      setOutput(res.data.data.ai_feedback)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] bg-[#0d1117]">
      
      {/* ── Left Side: Editor (70%) ── */}
      <div className={`flex flex-col ${output ? 'md:w-[70%]' : 'w-full'} transition-all duration-300 border-r border-[#30363d]`}>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 h-12 bg-[#161b22] border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">main.js</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="bg-[#0d1117] text-gray-300 border border-[#30363d] rounded px-2 py-1 text-xs font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {AI_MODELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Monaco */}
        <div className="flex-1 relative">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow-lg">
              <span>⚠️</span> {error}
            </div>
          )}
          <Editor
            theme="vs-dark"
            value={value}
            onChange={v => setValue(v || '')}
            options={{
              fontSize: 14,
              fontFamily: "var(--font-mono)",
              minimap: { enabled: false },
              padding: { top: 16 },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 h-14 bg-[#161b22] border-t border-[#30363d]">
          <button
            onClick={handleSubmit}
            disabled={loading || !value?.trim()}
            className="flex items-center gap-2 px-5 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-md border border-[rgba(240,246,252,0.1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              'Review Code'
            )}
          </button>
        </div>
      </div>

      {/* ── Right Side: Results (30%) ── */}
      {output && (
        <div className="w-full md:w-[30%] flex flex-col bg-[#0d1117] overflow-y-auto animate-in slide-in-from-right duration-300">
          
          {/* Score & Summary */}
          <div className="p-6 flex flex-col items-center border-b border-[#30363d] bg-[#161b22]">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Review Score</h2>
            <ScoreCircle score={output.score || 0} />
            <p className="text-sm text-gray-300 text-center leading-relaxed mt-2">
              {output.summary}
            </p>
          </div>

          {/* Issues List */}
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-4 flex items-center justify-between">
              Identified Issues
              <span className="bg-[#21262d] text-gray-400 px-2 py-0.5 rounded-full text-xs">
                {output.issues?.length || 0}
              </span>
            </h3>

            {output.issues?.length > 0 ? (
              <div className="space-y-3">
                {output.issues.map((issue, idx) => {
                  const isExpanded = expandedIssue === idx
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden"
                    >
                      {/* Issue Header */}
                      <button 
                        onClick={() => setExpandedIssue(isExpanded ? null : idx)}
                        className="w-full flex items-start gap-3 p-3 text-left hover:bg-[#21262d] transition-colors"
                      >
                        <div className="mt-0.5">
                          {isExpanded ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <SeverityBadge type={issue.severity} />
                            {issue.line && <span className="text-xs text-gray-500 font-mono">Line {issue.line}</span>}
                          </div>
                          <p className="text-sm text-gray-200 line-clamp-2">{issue.description}</p>
                        </div>
                      </button>

                      {/* Issue Details */}
                      {isExpanded && (
                        <div className="p-3 bg-[#0d1117] border-t border-[#30363d]">
                          <p className="text-xs text-gray-400 mb-2">Suggestion</p>
                          <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-sm text-gray-300 font-mono whitespace-pre-wrap">
                            {issue.fix}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#22c55e] mx-auto mb-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <p className="text-gray-400 text-sm">No issues found. Great job!</p>
              </div>
            )}
            
            {/* Tips / Improvements */}
            {output.improvements?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-white text-sm font-medium mb-3">General Tips</h3>
                <ul className="space-y-2">
                  {output.improvements.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-400 items-start">
                      <span className="text-[#3b82f6] mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}