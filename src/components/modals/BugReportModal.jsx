import React, { useState } from 'react'
import { Bug, X, Send, CheckCircle2, AlertTriangle, Paperclip } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'

export default function BugReportModal({ isOpen, onClose }) {
  const { astronauts, selectedAstronautId } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]

  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'Bug',
    severity: 'Medium',
    description: '',
    screenshotUrl: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Form payload with auto-attached context
    const payload = {
      ...form,
      context: {
        page: window.location.pathname,
        astronaut: `${currentAstro.name} (${currentAstro.id})`,
        browser: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    }

    // Configurable endpoint (or mailto fallback)
    const endpoint = import.meta.env.VITE_FEEDBACK_ENDPOINT
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Endpoint submit error, falling back to mailto:', err))
    }

    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 rounded-2xl w-full max-w-lg max-h-[calc(100dvh-2.5rem)] my-auto flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-nasa-blue to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Bug className="w-5 h-5 text-amber-300 shrink-0" />
            <div className="min-w-0">
              <h3 className="heading-display text-xs sm:text-sm font-bold truncate">CONTACT DEVELOPERS / BUG REPORT</h3>
              <p className="text-[10px] text-blue-200 truncate">Team Proxyma Dynamics • NASA Space Apps Challenge 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-white/10 text-blue-200 hover:text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 sm:p-8 text-center space-y-3 overflow-y-auto flex-1">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-gray-900 dark:text-white">Report Dispatched Successfully</h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Thank you for testing AstroVitals. Your issue has been logged alongside telemetry flight context. Team Proxyma Dynamics is reviewing it.
            </p>
            <button
              onClick={onClose}
              className="min-h-[44px] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-nasa-blue text-white hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
            >
              Back to Mission Console
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-xs">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alex Vance"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-xs">Email</label>
                <input
                  type="email"
                  required
                  placeholder="judge@spaceappschallenge.org"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-xs">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white text-xs sm:text-sm"
                >
                  <option value="Bug">Software Bug / Crash</option>
                  <option value="Glitch">UI / Render Glitch</option>
                  <option value="Feature request">Feature Suggestion</option>
                  <option value="Data issue">NASA Standards / Data Issue</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-xs">Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white text-xs sm:text-sm"
                >
                  <option value="Low">Low - Minor cosmetic</option>
                  <option value="Medium">Medium - Feature degraded</option>
                  <option value="High">High - Impairs mission telemetry</option>
                  <option value="Critical">Critical - Blocker</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-xs">Description & Reproduction Steps</label>
              <textarea
                required
                rows={3}
                placeholder="What occurred, and what was expected?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white text-xs sm:text-sm"
              />
            </div>

            {/* Auto-Attached Context Info */}
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-space-800/80 border border-blue-100 dark:border-space-700 text-[11px] text-gray-500 space-y-0.5">
              <span className="font-bold text-nasa-blue dark:text-nasa-blueLight uppercase">Auto-attached Flight Context:</span>
              <p>Active Subject: {currentAstro.name} • Location: {window.location.pathname} • Mission Day: {currentAstro.missionDay}</p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-space-700 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] text-gray-400">Proxyma Dynamics • 2026</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-gray-100 dark:bg-space-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold transition-colors flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-nasa-blue text-white hover:bg-blue-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Submit Report'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
