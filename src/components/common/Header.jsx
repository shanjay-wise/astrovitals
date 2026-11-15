import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sun, Moon, Bell, ChevronDown, UserPlus, Users,
  AlertTriangle, Shield, Sliders, Bug, Sparkles, Activity
} from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import { computeHealthStatus } from '../../services/healthScoring'

export default function Header({ dataSource = 'LIVE NASA' }) {
  const navigate = useNavigate()
  const {
    astronauts,
    selectedAstronautId,
    selectAstronaut,
    darkMode,
    toggleDarkMode,
    alerts,
    currentVitals,
    setBugModalOpen,
    setSettingsModalOpen,
    setProfileModalOpen,
    setSimulatorModalOpen,
    activeScenario,
    simulationSpeed
  } = useAstroStore()

  const [crewOpen, setCrewOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const currentHealth = computeHealthStatus(currentAstro, currentVitals, alerts)
  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCrewOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-space-900/90 backdrop-blur-md border-b border-gray-200 dark:border-space-700 px-4 py-2.5 transition-colors">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Logo & MET */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Custom NASA-Style AstroVitals SVG Logo */}
            <svg className="w-8 h-8 group-hover:scale-105 transition-transform" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#0B3D91" strokeWidth="2" className="dark:stroke-blue-500" />
              <path d="M7 23C13 14 27 14 33 23" stroke="#FC3D21" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="18" r="4.5" fill="#1E6BFF" />
              <path d="M14 26L20 12L26 26" stroke="#22C55E" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="heading-display text-base font-extrabold text-gray-900 dark:text-white tracking-wider">
                  ASTROVITALS
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-nasa-blue text-white font-bold">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                Proxyma Dynamics • NASA Space Apps
              </p>
            </div>
          </div>

          {/* Mission Elapsed Time (MET) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-space-800 border border-gray-200 dark:border-space-700 text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-[10px]">MET:</span>
            <span className="mono-data font-bold text-nasa-blue dark:text-nasa-blueLight">
              Day {currentAstro.missionDay} • {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
            </span>
            {simulationSpeed > 1 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40">
                {simulationSpeed}x SPEED
              </span>
            )}
          </div>
        </div>

        {/* Center: Active Scenario Banner (if any injected) */}
        {activeScenario && (
          <div
            onClick={() => setSimulatorModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-pulse cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Scenario Active: {activeScenario.name}</span>
          </div>
        )}

        {/* Right: Controls & Astronaut Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Data Source Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>{dataSource}</span>
          </div>

          {/* Simulator Button */}
          <button
            onClick={() => setSimulatorModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-space-700 transition-colors"
            title="Launch Mission Scenario Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-nasa-blue dark:text-nasa-blueLight" />
            <span className="hidden md:inline">Simulator</span>
          </button>

          {/* Astronaut Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCrewOpen(!crewOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 border border-gray-200 dark:border-space-700 transition-colors"
            >
              <span className="text-lg">{currentAstro.avatar}</span>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[110px]">
                    {currentAstro.name.split(' ').slice(-1)[0]}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    currentHealth.status === 'nominal' ? 'bg-status-nominal' :
                    currentHealth.status === 'caution' ? 'bg-status-caution' : 'bg-status-critical'
                  }`} />
                </div>
                <p className="text-[9px] text-gray-400 leading-tight truncate max-w-[110px]">
                  {currentAstro.role}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${crewOpen ? 'rotate-180' : ''}`} />
            </button>

            {crewOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-space-900 rounded-xl shadow-2xl border border-gray-200 dark:border-space-700 p-2 z-50">
                <div className="px-2 py-1.5 mb-1 border-b border-gray-100 dark:border-space-700 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Expedition Crew</span>
                  <button
                    onClick={() => { setCrewOpen(false); navigate('/crew'); }}
                    className="text-[10px] text-nasa-blue dark:text-nasa-blueLight hover:underline font-semibold"
                  >
                    Compare All →
                  </button>
                </div>

                <div className="space-y-1">
                  {astronauts.map(astro => {
                    const isSelected = astro.id === currentAstro.id
                    const astroHealth = computeHealthStatus(astro, isSelected ? currentVitals : null, alerts)
                    return (
                      <button
                        key={astro.id}
                        onClick={() => { selectAstronaut(astro.id); setCrewOpen(false); }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-nasa-blue/10 dark:bg-nasa-blueLight/20 text-nasa-blue dark:text-nasa-blueLight font-semibold'
                            : 'hover:bg-gray-100 dark:hover:bg-space-800 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{astro.avatar}</span>
                          <div>
                            <p className="text-xs font-semibold">{astro.name}</p>
                            <p className="text-[10px] text-gray-400">{astro.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="mono-data text-[10px] text-gray-400 font-semibold">{astroHealth.score}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            astroHealth.status === 'nominal' ? 'bg-status-nominal' :
                            astroHealth.status === 'caution' ? 'bg-status-caution' : 'bg-status-critical'
                          }`} />
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-space-700 flex items-center gap-1">
                  <button
                    onClick={() => { setCrewOpen(false); setProfileModalOpen(true, null); }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-nasa-blue text-white hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add New Astronaut</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alerts Bell Icon */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-space-700 transition-colors"
            title="View Mission Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-critical text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Dark/Light Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-space-700 transition-colors"
            title="Toggle Dark / Light Theme"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

          {/* Bug Report Button */}
          <button
            onClick={() => setBugModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-space-700 transition-colors"
          >
            <Bug className="w-3.5 h-3.5 text-amber-500" />
            <span>Report Bug</span>
          </button>
        </div>
      </div>
    </header>
  )
}
