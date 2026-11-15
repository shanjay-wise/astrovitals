import React, { useState } from 'react'
import {
  AlertTriangle, ShieldAlert, Info, CheckCircle2,
  Check, X, Filter, Search, User, Clock, Zap
} from 'lucide-react'
import { useAstroStore } from '../store/useAstroStore'

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, dismissAlert, astronauts, selectedAstronautId, addAlert } = useAstroStore()
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterCrew, setFilterCrew] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]

  const handleSimulateAlert = () => {
    const newAlt = {
      id: `SIM-${Date.now().toString().slice(-4)}`,
      astronautId: currentAstro.id,
      timestamp: new Date().toISOString(),
      severity: 'warning',
      metric: 'Cardiovascular Transient',
      title: 'Premature Ventricular Contraction Burst',
      message: `Lead-II surface ECG detected a cluster of 3 premature beats during workout cycle.`,
      recommendation: 'Pause current physical activity. Execute 10-minute resting autonomic reassessment.',
      acknowledged: false
    }
    addAlert(newAlt)
  }

  const filtered = alerts.filter(alt => {
    const matchSev = filterSeverity === 'all' || alt.severity === filterSeverity
    const matchCrew = filterCrew === 'all' || alt.astronautId === filterCrew || !alt.astronautId
    const matchSearch = (alt.title || alt.metric || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (alt.message || alt.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchSev && matchCrew && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              MISSION CONTROL ALERT CENTER & TRIAGE
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time multi-signal anomalies, flight surgeon directives, and telemetry notifications
          </p>
        </div>

        <button
          onClick={handleSimulateAlert}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all self-start sm:self-auto"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Simulate Telemetry Anomaly</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mission-card p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-colors ${
                filterSeverity === sev
                  ? 'bg-nasa-blue text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-space-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterCrew}
            onChange={(e) => setFilterCrew(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-gray-50 dark:bg-space-800 border border-gray-200 dark:border-space-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Expedition Crew</option>
            {astronauts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-gray-50 dark:bg-space-800 border border-gray-200 dark:border-space-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="mission-card p-12 text-center text-xs text-gray-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-70" />
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Zero active alerts matching filters</p>
            <p className="text-[11px] mt-0.5">All telemetry indicators are operating within nominal NASA-STD-3001 bounds.</p>
          </div>
        ) : (
          filtered.map((alt) => {
            const astro = astronauts.find(a => a.id === alt.astronautId)
            return (
              <div
                key={alt.id}
                className={`mission-card p-4 border-l-4 transition-all ${
                  alt.severity === 'critical'
                    ? 'border-l-red-500 bg-red-50/30 dark:bg-red-950/20'
                    : alt.severity === 'warning'
                    ? 'border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/15'
                    : 'border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/15'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`p-2 rounded-xl mt-0.5 ${
                      alt.severity === 'critical' ? 'bg-red-500 text-white animate-pulse' :
                      alt.severity === 'warning' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {alt.severity === 'critical' ? <ShieldAlert className="w-5 h-5" /> :
                       alt.severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                       <Info className="w-5 h-5" />}
                    </span>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="mono-data text-xs font-bold text-gray-400">{alt.id}</span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                          {alt.title || alt.metric}
                        </h3>
                        <span className={`status-${alt.severity}`}>
                          {alt.severity.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {alt.message || alt.description}
                      </p>

                      <div className="p-2 rounded-lg bg-white/60 dark:bg-space-800 border border-gray-100 dark:border-space-700 text-xs">
                        <span className="font-bold text-nasa-blue dark:text-nasa-blueLight">Recommended Clinical Directive: </span>
                        <span className="text-gray-800 dark:text-gray-200">{alt.recommendation}</span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {astro ? `${astro.avatar} ${astro.name}` : 'Mission-Wide'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(alt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-space-700">
                    {alt.acknowledged ? (
                      <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Acknowledged
                      </span>
                    ) : (
                      <button
                        onClick={() => acknowledgeAlert(alt.id)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => dismissAlert(alt.id)}
                      className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
