import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeartPulse, Shield, AlertTriangle, ArrowRight, Activity,
  Sliders, User, Clock, Compass, Zap
} from 'lucide-react'
import { useAstroStore } from '../store/useAstroStore'
import { computeHealthStatus } from '../services/healthScoring'
import SpacesuitDiagram from '../components/dashboard/SpacesuitDiagram'
import HealthScoreRing from '../components/dashboard/HealthScoreRing'
import SpaceWeatherWidget from '../components/dashboard/SpaceWeatherWidget'
import MissionTimeline from '../components/dashboard/MissionTimeline'
import AlertFeedWidget from '../components/dashboard/AlertFeedWidget'
import FeatureSummaryGrid from '../components/dashboard/FeatureSummaryGrid'
import { generateECGData } from '../data/vitalsData'
import { AreaChart, Area, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const navigate = useNavigate()
  const {
    astronauts,
    selectedAstronautId,
    selectAstronaut,
    currentVitals,
    currentStatuses,
    currentHealthScore,
    vitalsHistory,
    alerts,
    setSimulatorModalOpen
  } = useAstroStore()

  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [ecgData, setEcgData] = useState(() => generateECGData(200))

  // Single shared health status and score computation
  const health = computeHealthStatus(currentAstro, currentVitals, alerts)

  // Live ECG updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgData(generateECGData(200))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-5">
      {/* Top Banner: Astronaut Profile Strip & Simulator Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-nasa-blue/10 via-blue-500/5 to-transparent dark:from-space-900 dark:to-space-900 border border-nasa-blue/20">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 rounded-xl bg-white dark:bg-space-800 border border-gray-200 dark:border-space-700 shadow-sm">
            {currentAstro.avatar}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="heading-display text-lg font-bold text-gray-900 dark:text-white">
                {currentAstro.name}
              </h2>
              <span className={`status-${health.status}`}>
                {health.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentAstro.role} • {currentAstro.mission} • Blood: {currentAstro.bloodType} • Age: {currentAstro.age} • Day {currentAstro.missionDay}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/crew')}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-space-800 hover:bg-gray-100 dark:hover:bg-space-700 border border-gray-200 dark:border-space-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center"
          >
            Crew Table
          </button>
          <button
            onClick={() => setSimulatorModalOpen(true)}
            className="min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Launch Simulator</span>
          </button>
        </div>
      </div>

      {/* Row 1: Core Biometrics Centerpiece */}
      {/* Left: Health Score Ring | Center: Interactive Spacesuit Diagram | Right: Space Weather + Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Health Score Ring (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <HealthScoreRing
            score={health.score}
            astronaut={currentAstro}
            vitals={currentVitals}
            statuses={health.statuses}
            alerts={alerts}
            healthInfo={health}
          />
          <SpaceWeatherWidget />
        </div>

        {/* Center Column: Interactive Spacesuit Diagram (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <SpacesuitDiagram vitals={currentVitals} statuses={health.statuses} />
        </div>

        {/* Right Column: Alert Feed & Mission Timeline (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <AlertFeedWidget />
          <MissionTimeline missionDay={currentAstro.missionDay} />
        </div>
      </div>

      {/* Row 2: Live Lead-II ECG Telemetry Stream */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              LIVE LEAD-II SURFACE ECG TELEMETRY
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300 dark:border-red-800">
              500 Hz BIO-HARNESS
            </span>
          </div>
          <span className="mono-data text-sm font-bold text-red-600 dark:text-red-400">
            {currentVitals?.hr || currentAstro.baselines.hr} BPM
          </span>
        </div>

        <div className="h-28 w-full bg-space-950/5 dark:bg-space-950/70 rounded-lg p-1.5 border border-gray-100 dark:border-space-800">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ecgData}>
              <defs>
                <linearGradient id="ecgHomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#263859" opacity={0.3} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#ecgHomeGrad)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: All 12 Subsystems Summary Grid */}
      <FeatureSummaryGrid
        vitals={currentVitals}
        statuses={health.statuses}
        vitalsHistory={vitalsHistory}
      />
    </div>
  )
}
