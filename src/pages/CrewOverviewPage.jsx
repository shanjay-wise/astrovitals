import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, UserPlus, HeartPulse, Brain, RadioTower,
  ShieldAlert, TrendingUp, TrendingDown, ArrowRight, Edit, AlertTriangle
} from 'lucide-react'
import { useAstroStore } from '../store/useAstroStore'
import { computeHealthStatus } from '../services/healthScoring'

export default function CrewOverviewPage() {
  const navigate = useNavigate()
  const {
    astronauts,
    selectedAstronautId,
    selectAstronaut,
    setProfileModalOpen,
    alerts,
    currentVitals
  } = useAstroStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-nasa-blue dark:text-nasa-blueLight" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              EXPEDITION CREW HEALTH COMPARISON
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Cross-crew comparative biometrics, risk stratification, and flight readiness indicators
          </p>
        </div>

        <button
          onClick={() => setProfileModalOpen(true, null)}
          className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Astronaut Profile</span>
        </button>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {astronauts.map((astro) => {
          const isSelected = astro.id === selectedAstronautId
          const health = computeHealthStatus(astro, isSelected ? currentVitals : null, alerts)
          const astroAlerts = health.activeAlerts

          return (
            <div
              key={astro.id}
              className={`mission-card flex flex-col justify-between transition-all ${isSelected
                  ? 'ring-2 ring-nasa-blue dark:ring-nasa-blueLight shadow-lg'
                  : 'hover:border-gray-300 dark:hover:border-space-600'
                }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl p-2 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-100 dark:border-space-700">
                    {astro.avatar}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setProfileModalOpen(true, astro); }}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      title="Edit Profile"
                      aria-label="Edit Profile"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <span className={`status-${health.status}`}>
                      {health.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {astro.name}
                </h3>
                <p className="text-xs text-gray-400 mb-3">{astro.role}</p>

                {/* Score & Key Metrics */}
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-800 space-y-1.5 text-xs mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-400">Health Index:</span>
                    <span className="mono-data font-bold text-base text-gray-900 dark:text-white">
                      {health.score} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resting HR:</span>
                    <span className="mono-data font-semibold">{astro.baselines.hr} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blood Pressure:</span>
                    <span className="mono-data font-semibold">{astro.baselines.bpSys}/{astro.baselines.bpDia} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bone Density Retained:</span>
                    <span className={`mono-data font-semibold ${astro.baselines.boneDensity < 92 ? 'text-amber-500' : ''}`}>
                      {astro.baselines.boneDensity}%
                    </span>
                  </div>
                </div>

                {/* Active Alerts Count */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-gray-400">Active Warnings:</span>
                  {astroAlerts.length > 0 ? (
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {astroAlerts.length} Active
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-semibold">0 (Nominal)</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => { selectAstronaut(astro.id); navigate('/'); }}
                className={`w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${isSelected
                    ? 'bg-nasa-blue text-white'
                    : 'bg-gray-100 dark:bg-space-800 hover:bg-nasa-blue hover:text-white text-gray-700 dark:text-gray-200'
                  }`}
              >
                <span>{isSelected ? 'Currently Monitored' : 'Switch Telemetry to Crew'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Comparative Table */}
      <div className="mission-card overflow-hidden">
        <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-3">
          DETAILED EXPEDITION BIOMETRIC LOG (NASA-STD-3001)
        </h3>
        <div className="overflow-x-auto -mx-1 sm:mx-0 scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-space-700 text-[10px] text-gray-400 uppercase">
                <th className="pb-2">Astronaut</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Health Index</th>
                <th className="pb-2">Resting HR</th>
                <th className="pb-2">Blood Pressure</th>
                <th className="pb-2">Target Sleep</th>
                <th className="pb-2">Bone Retained</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-space-800">
              {astronauts.map((a) => {
                const isSelected = a.id === selectedAstronautId
                const aHealth = computeHealthStatus(a, isSelected ? currentVitals : null, alerts)
                return (
                  <tr
                    key={a.id}
                    onClick={() => selectAstronaut(a.id)}
                    className="hover:bg-gray-50 dark:hover:bg-space-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-bold flex items-center gap-2">
                      <span className="text-base">{a.avatar}</span>
                      <span>{a.name}</span>
                    </td>
                    <td className="text-gray-500 dark:text-gray-400">{a.role}</td>
                    <td className="mono-data font-bold text-nasa-blue dark:text-nasa-blueLight">{aHealth.score}%</td>
                    <td className="mono-data">{a.baselines.hr} bpm</td>
                    <td className="mono-data">{a.baselines.bpSys}/{a.baselines.bpDia} mmHg</td>
                    <td className="mono-data">{a.baselines.sleepHrs} hrs</td>
                    <td className="mono-data font-semibold">{a.baselines.boneDensity}%</td>
                    <td>
                      <span className={`status-${aHealth.status}`}>
                        {aHealth.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
