import { useState } from 'react'
import {
  AlertTriangle, CheckCircle2, ShieldAlert, Info, Bell,
  Filter, Search, User, Clock, ChevronRight, Check, Zap
} from 'lucide-react'
import { alertsData as initialAlerts, getAlertCounts } from '../data/alertsData'
import { crewMembers } from '../data/crewData'
import { useCrew } from '../context/CrewContext'

export default function Alerts() {
  const { currentMember } = useCrew()
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterCrew, setFilterCrew] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
  }

  const handleTriggerSimulatedAlert = () => {
    const newAlert = {
      id: `SIM-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      missionDay: currentMember.missionDay,
      crewId: currentMember.id,
      crewName: currentMember.name,
      type: 'vitals',
      severity: 'warning',
      title: 'Simulated Arrhythmia Transient (PAC)',
      description: 'Premature Atrial Contraction detected during microgravity exercise surge. Monitored autonomously via lead-II ECG algorithm.',
      module: 'Cardiac Monitor',
      acknowledged: false,
      actionRequired: true,
    }
    setAlerts([newAlert, ...alerts])
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesCrew = filterCrew === 'all' || alert.crewId === filterCrew || alert.crewId === null
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.module.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeverity && matchesCrew && matchesSearch
  })

  const alertCounts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
    info: alerts.filter(a => a.severity === 'info').length,
    nominal: alerts.filter(a => a.severity === 'nominal').length,
    total: alerts.length,
    active: alerts.filter(a => !a.acknowledged || a.actionRequired).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">MISSION CONTROL ALERT LOG</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              FLIGHT SURGEON CONSOLE
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Autonomous triage, threshold exceedances, and NASA bio-telemetry notifications
          </p>
        </div>

        <button
          onClick={handleTriggerSimulatedAlert}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nasa-blue text-white hover:bg-blue-700 text-xs font-semibold shadow transition-all self-start sm:self-auto"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Simulate Telemetry Event</span>
        </button>
      </div>

      {/* Severity Count Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 flex items-center gap-3 border-l-4 border-l-red-500">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="mono-data text-2xl font-bold text-gray-900 dark:text-white">{alertCounts.critical}</p>
            <p className="text-xs text-gray-400">Critical Alerts</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 border-l-4 border-l-amber-500">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="mono-data text-2xl font-bold text-gray-900 dark:text-white">{alertCounts.warning}</p>
            <p className="text-xs text-gray-400">Active Warnings</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 border-l-4 border-l-blue-500">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <p className="mono-data text-2xl font-bold text-gray-900 dark:text-white">{alertCounts.info}</p>
            <p className="text-xs text-gray-400">Informational</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 border-l-4 border-l-emerald-500">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="mono-data text-2xl font-bold text-gray-900 dark:text-white">{alertCounts.nominal}</p>
            <p className="text-xs text-gray-400">Resolved / Nominal</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-space-600 text-xs text-gray-600 dark:text-gray-300">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity:</span>
          </div>
          {['all', 'critical', 'warning', 'info', 'nominal'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterSeverity === sev
                  ? 'bg-nasa-blue text-white dark:bg-blue-600'
                  : 'bg-gray-100 dark:bg-space-600/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-space-500'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Crew Filter */}
          <select
            value={filterCrew}
            onChange={(e) => setFilterCrew(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-space-600 border border-gray-200 dark:border-space-500 text-gray-800 dark:text-gray-200"
          >
            <option value="all">All Crew Members</option>
            {crewMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-space-600 border border-gray-200 dark:border-space-500 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="text-base font-semibold">No alerts match the selected criteria</p>
            <p className="text-xs text-gray-500 mt-1">All biomedical systems operating within nominal limits.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`card p-4 border-l-4 transition-all ${
                alert.severity === 'critical' ? 'border-l-red-500 bg-red-50/30 dark:bg-red-950/20' :
                alert.severity === 'warning' ? 'border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/10' :
                alert.severity === 'info' ? 'border-l-blue-500' : 'border-l-emerald-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' :
                    alert.severity === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' :
                    alert.severity === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                  }`}>
                    {alert.severity === 'critical' ? <ShieldAlert className="w-5 h-5" /> :
                     alert.severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                     alert.severity === 'info' ? <Info className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mono-data text-xs font-bold text-gray-400">{alert.id}</span>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{alert.title}</h3>
                      <span className={`status-${alert.severity}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {alert.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {alert.crewName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Mission Day {alert.missionDay} • {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-space-600 text-gray-600 dark:text-gray-300 font-medium">
                        Module: {alert.module}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-space-600">
                  {alert.acknowledged ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                      <Check className="w-3.5 h-3.5" /> ACKNOWLEDGED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-space-600 dark:hover:bg-space-500 text-gray-800 dark:text-gray-200 text-xs font-semibold transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.actionRequired && (
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      ACTION MANDATED
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
