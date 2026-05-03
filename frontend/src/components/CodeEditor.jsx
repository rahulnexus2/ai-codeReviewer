import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import api from '../services/api'

const AI_MODELS = [
  { value: 'hugging-face', label: ' Llama3.1' },
  { value: 'gemini', label: 'gemini-flash-2.5' },
  { value: 'grok', label: 'grok' },
  
]

const SEVERITY = {
  high:   { border: 'border-l-red-500',    bg: 'bg-red-500/5',    text: 'text-red-400',    dot: 'bg-red-500',    label: 'HIGH' },
  medium: { border: 'border-l-yellow-500', bg: 'bg-yellow-500/5', text: 'text-yellow-400', dot: 'bg-yellow-500', label: 'MEDIUM' },
  low:    { border: 'border-l-green-500',  bg: 'bg-green-500/5',  text: 'text-green-400',  dot: 'bg-green-500',  label: 'LOW' },
}

export default function CodeEditor() {
  const [value, setValue] = useState('')
  const [model, setModel] = useState('gemini-flash-2.5')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('issues')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!value?.trim()) return
    setLoading(true)
    setError(null)
    setOutput(null)
    try {
      const res = await api.post('/code/review', { model, original_code: value }, { timeout: 60000 })
      const review = res.data.data.ai_feedback
      setOutput(review)
      setActiveTab(review.issues?.length > 0 ? 'issues' : 'improvements')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(output?.optimizedCode || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'issues',        label: 'Issues',        count: output?.issues?.length ?? 0 },
    { id: 'improvements',  label: 'Improvements',  count: output?.improvements?.length ?? 0 },
    { id: 'code',          label: 'Optimized Code', count: output?.optimizedCode ? 1 : 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            ⚡ Code Reviewer
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
             Choose Models
            </span>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="bg-gray-900 text-slate-200 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer transition"
            >
              {AI_MODELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-xl overflow-hidden border border-gray-800 shadow-2xl mb-4">
          {/* Traffic lights bar */}
          <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2 border-b border-gray-800">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-gray-500 font-mono">{model}</span>
          </div>
          <Editor
            height="55vh"
            theme="vs-dark"
            AI_MODELS={model}
            value={value}
            onChange={v => setValue(v || '')}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: 'line',
            }}
          />
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <span className="text-xs text-gray-600 font-mono">
            {value.length} chars · {value.split('\n').length} lines
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || !value?.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
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

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Review Output */}
        {output && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

            {/* Summary */}
            <div className="flex gap-4 items-start px-6 py-5 border-b border-gray-800">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-base flex-shrink-0">
                📋
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">
                  Summary
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">{output.summary}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 px-4 gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-3.5 text-xs font-semibold border-b-2 transition-colors -mb-px ${
                    activeTab === tab.id
                      ? 'border-violet-500 text-violet-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab.id
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-gray-800 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">

              {/* Issues Tab */}
              {activeTab === 'issues' && (
                output.issues?.length > 0 ? (
                  <div className="space-y-3">
                    {output.issues.map((issue, i) => {
                      const sev = SEVERITY[issue.severity] || SEVERITY.low
                      return (
                        <div key={i} className={`border-l-4 rounded-lg p-4 ${sev.border} ${sev.bg}`}>
                          <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 ${sev.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                            {sev.label}
                          </div>
                          <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                            {issue.description}
                          </p>
                          <div className="flex gap-2 text-xs text-slate-500">
                            <span className="text-violet-400 font-bold flex-shrink-0">FIX</span>
                            {issue.fix}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-slate-600 text-sm py-8">✅ No issues found</p>
                )
              )}

              {/* Improvements Tab */}
              {activeTab === 'improvements' && (
                output.improvements?.length > 0 ? (
                  <div className="divide-y divide-gray-800">
                    {output.improvements.map((tip, i) => (
                      <div key={i} className="flex gap-3 py-3 text-sm text-slate-400 leading-relaxed">
                        <span className="text-violet-400 font-mono font-semibold text-xs mt-0.5 flex-shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {tip}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-600 text-sm py-8">No suggestions available</p>
                )
              )}

              {/* Optimized Code Tab */}
              {activeTab === 'code' && (
                output.optimizedCode ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Refactored Version
                      </span>
                      <button
                        onClick={copyCode}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          copied
                            ? 'border-green-500/40 text-green-400 bg-green-500/10'
                            : 'border-gray-700 text-slate-400 bg-gray-800 hover:border-violet-500/40 hover:text-violet-400'
                        }`}
                      >
                        {copied ? '✓ Copied' : '⎘ Copy'}
                      </button>
                    </div>
                    <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-xs text-cyan-300 font-mono leading-relaxed whitespace-pre">
                      {output.optimizedCode}
                    </pre>
                  </>
                ) : (
                  <p className="text-center text-slate-600 text-sm py-8">
                    No optimized version available
                  </p>
                )
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  )
}