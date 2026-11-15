import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, ShieldAlert, Info, CheckCircle2,
  Check, X, Eye, ArrowRight, Volume2
} from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'

export default function AlertFeedWidget() {
  const navigate = useNavigate()
  const { alerts, acknowledgeAlert, dismissAlert, astronauts, selectedAstronautId } = useAstroStore()
  const [filterSeverity, setFilterSeverity] = useState('all')

  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]

  // Filter alerts for current astronaut or mission-wide
  const filtered = alerts.filter(a => {
    const matchesAstro = !a.astronautId || a.astronautId === currentAstro.id
    const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity
    return matchesAstro && matchesSeverity
  })

  return (
    <div className="mission-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            MISSION CONTROL ALERT FEED
          </h3>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1">
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                filterSeverity === sev
                  ? 'bg-nasa-blue text-white dark:bg-nasa-blueLight dark:text-space-950'
                  : 'bg-gray-100 dark:bg-space-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-2 overflow-y-auto max-h-[250px] scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-70" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">All channels operating within nominal range</p>
            <p className="text-[10px] mt-0.5">No active alerts for {currentAstro.name}</p>
          </div>
        ) : (
          filtered.slice(0, 4).map((alt) => (
            <div
              key={alt.id}
              className={`p-3 rounded-lg border text-xs transition-all ${
                alt.severity === 'critical'
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/60'
                  : alt.severity === 'warning'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                  : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className={`p-1 rounded mt-0.5 ${
                    alt.severity === 'critical' ? 'bg-red-500 text-white animate-pulse' :
                    alt.severity === 'warning' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {alt.severity === 'critical' ? <ShieldAlert className="w-3.5 h-3.5" /> :
                     alt.severity === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                     <Info className="w-3.5 h-3.5" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {alt.title || alt.metric}
                      </span>
                      <span className="mono-data text-[10px] text-gray-400">
                        {new Date(alt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {alt.message || alt.description}
                    </p>

                    <p className="text-[10px] text-nasa-blue dark:text-nasa-blueLight font-semibold mt-1">
                      Directive: {alt.recommendation}
                    </p>
                  </div>
                </div>

                {/* Actions: Acknowledge & Dismiss */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!alt.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="p-1 rounded bg-gray-200 dark:bg-space-700 hover:bg-emerald-500 hover:text-white text-gray-600 dark:text-gray-300 text-[10px] font-semibold transition-colors"
                      title="Acknowledge alert"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alt.id)}
                    className="p-1 rounded bg-gray-200 dark:bg-space-700 hover:bg-red-500 hover:text-white text-gray-400 hover:text-white transition-colors"
                    title="Dismiss alert"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-space-800 flex items-center justify-between text-xs">
        <span className="text-[10px] text-gray-400">
          Showing {filtered.length} alert{filtered.length !== 1 ? 's' : ''} for {currentAstro.name}
        </span>
        <button
          onClick={() => navigate('/alerts')}
          className="text-[11px] text-nasa-blue dark:text-nasa-blueLight font-semibold hover:underline flex items-center gap-1"
        >
          View Full Triage Log <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
