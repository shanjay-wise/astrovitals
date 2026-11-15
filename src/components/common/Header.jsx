import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import {
  Sun, Moon, Bell, ChevronDown, UserPlus, Users,
  AlertTriangle, Shield, Sliders, Bug, Sparkles, Activity,
  Menu, X, Settings, HeartPulse, Wind, Thermometer,
  RadioTower, Dumbbell, Brain, Smile, Droplets,
  Eye, Home, FileText, Database, LayoutDashboard
} from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import { computeHealthStatus } from '../../services/healthScoring'

export const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/crew', icon: Users, label: 'Crew' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  { to: '/tabs/cardiovascular', icon: HeartPulse, label: 'Cardio' },
  { to: '/tabs/respiratory', icon: Wind, label: 'Respiratory' },
  { to: '/tabs/temperature', icon: Thermometer, label: 'Temperature' },
  { to: '/tabs/sleep', icon: Moon, label: 'Sleep' },
  { to: '/tabs/radiation', icon: RadioTower, label: 'Radiation' },
  { to: '/tabs/musculoskeletal', icon: Dumbbell, label: 'Musculoskeletal' },
  { to: '/tabs/neuro-cognitive', icon: Brain, label: 'Neuro' },
  { to: '/tabs/mental-health', icon: Smile, label: 'Mental Health' },
  { to: '/tabs/nutrition', icon: Droplets, label: 'Nutrition' },
  { to: '/tabs/fluid-shift', icon: Eye, label: 'Fluid Shift' },
  { to: '/tabs/habitat', icon: Home, label: 'Habitat' },
  { to: '/tabs/medical-log', icon: FileText, label: 'Medical Log' },
  { to: '/sources', icon: Database, label: 'Data Sources' }
]

export default function Header({ dataSource = 'LIVE NASA' }) {
  const navigate = useNavigate()
  const location = useLocation()
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileNavRef = useRef(null)

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

  // Auto-scroll active tab into view in mobile scrollable row
  useEffect(() => {
    if (mobileNavRef.current) {
      const activeEl = mobileNavRef.current.querySelector('.mobile-tab-active')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-space-900/95 backdrop-blur-md border-b border-gray-200 dark:border-space-700 transition-colors">
      {/* Main Top Header Bar */}
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5">
        {/* Left: Logo & MET */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Hamburger Button (< lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-space-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-space-700 transition-colors shrink-0"
            aria-label="Toggle navigation menu"
            title="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-nasa-blue" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group min-w-0 shrink"
          >
            {/* Custom NASA-Style AstroVitals SVG Logo */}
            <svg className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-105 transition-transform shrink-0" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#0B3D91" strokeWidth="2" className="dark:stroke-blue-500" />
              <path d="M7 23C13 14 27 14 33 23" stroke="#FC3D21" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="18" r="4.5" fill="#1E6BFF" />
              <path d="M14 26L20 12L26 26" stroke="#22C55E" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="heading-display text-sm sm:text-base font-extrabold text-gray-900 dark:text-white tracking-wider truncate">
                  ASTROVITALS
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-nasa-blue text-white font-bold hidden sm:inline-block">
                  v2.0
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-tight truncate hidden xs:block">
                Proxyma Dynamics • NASA Space Apps
              </p>
            </div>
          </div>

          {/* Mission Elapsed Time (MET) on desktop */}
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

        {/* Center: Active Scenario Banner */}
        {activeScenario && (
          <div
            onClick={() => setSimulatorModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-pulse cursor-pointer shrink-0"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate max-w-[200px]">Active: {activeScenario.name}</span>
          </div>
        )}

        {/* Right: Controls & Astronaut Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Data Source Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>{dataSource}</span>
          </div>

          {/* Simulator Button */}
          <button
            onClick={() => setSimulatorModalOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-space-700 transition-colors"
            title="Launch Mission Scenario Simulator"
            aria-label="Simulator"
          >
            <Sliders className="w-4 h-4 text-nasa-blue dark:text-nasa-blueLight shrink-0" />
            <span className="hidden md:inline">Simulator</span>
          </button>

          {/* Astronaut Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCrewOpen(!crewOpen)}
              className="min-h-[44px] flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 border border-gray-200 dark:border-space-700 transition-colors"
              aria-label="Select Astronaut"
            >
              <span className="text-xl sm:text-lg shrink-0">{currentAstro.avatar}</span>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px]">
                    {currentAstro.name.split(' ').slice(-1)[0]}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    currentHealth.status === 'nominal' ? 'bg-status-nominal' :
                    currentHealth.status === 'caution' ? 'bg-status-caution' : 'bg-status-critical'
                  }`} />
                </div>
                <p className="text-[9px] text-gray-400 leading-tight truncate max-w-[100px]">
                  {currentAstro.role}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${crewOpen ? 'rotate-180' : ''}`} />
            </button>

            {crewOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-[320px] bg-white dark:bg-space-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-space-700 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 mb-1 border-b border-gray-100 dark:border-space-700 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Expedition Crew</span>
                  <button
                    onClick={() => { setCrewOpen(false); navigate('/crew'); }}
                    className="text-[11px] text-nasa-blue dark:text-nasa-blueLight hover:underline font-semibold"
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
                        className={`w-full min-h-[44px] flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? 'bg-nasa-blue/10 dark:bg-nasa-blueLight/20 text-nasa-blue dark:text-nasa-blueLight font-semibold'
                            : 'hover:bg-gray-100 dark:hover:bg-space-800 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{astro.avatar}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{astro.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{astro.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="mono-data text-[10px] text-gray-400 font-semibold">{astroHealth.score}</span>
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            astroHealth.status === 'nominal' ? 'bg-status-nominal' :
                            astroHealth.status === 'caution' ? 'bg-status-caution' : 'bg-status-critical'
                          }`} />
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-space-700">
                  <button
                    onClick={() => { setCrewOpen(false); setProfileModalOpen(true, null); }}
                    className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-nasa-blue text-white hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>Add New Astronaut</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alerts Bell Icon */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-space-700 transition-colors"
            title="View Mission Alerts"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-status-critical text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Dark/Light Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-space-700 transition-colors"
            title="Toggle Dark / Light Theme"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

          {/* Bug Report Button (desktop) */}
          <button
            onClick={() => setBugModalOpen(true)}
            className="hidden sm:flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-space-700 transition-colors"
            title="Report Bug / Feedback"
          >
            <Bug className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Bug</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontally Scrollable Tabs Row (< lg) */}
      <nav
        ref={mobileNavRef}
        className="lg:hidden w-full bg-gray-50/90 dark:bg-space-950/90 border-t border-gray-200 dark:border-space-800 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 whitespace-nowrap"
        aria-label="Biomedical Subsystems Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'mobile-tab-active bg-nasa-blue text-white shadow-md'
                  : 'bg-white dark:bg-space-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-space-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Mobile Full Navigation Drawer (< lg) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-start animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white dark:bg-space-900 border-b border-gray-200 dark:border-space-700 p-4 max-h-[85dvh] overflow-y-auto space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-space-700">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-nasa-blue dark:text-nasa-blueLight" />
                <span className="heading-display text-sm font-bold text-gray-900 dark:text-white">
                  MISSION NAVIGATION
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-space-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MET Strip */}
            <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-space-800 text-xs flex items-center justify-between">
              <span className="text-gray-400 font-semibold uppercase text-[10px]">MET:</span>
              <span className="mono-data font-bold text-nasa-blue dark:text-nasa-blueLight">
                Day {currentAstro.missionDay} • {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
              </span>
            </div>

            {/* Navigation Links Grid */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400 px-2 pt-1">All Telemetry Modules</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
                  return (
                    <button
                      key={item.to}
                      onClick={() => {
                        navigate(item.to)
                        setMobileMenuOpen(false)
                      }}
                      className={`min-h-[44px] w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-nasa-blue text-white font-bold shadow'
                          : 'bg-gray-50 dark:bg-space-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-space-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-gray-200 dark:border-space-700 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSettingsModalOpen(true)
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-space-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setBugModalOpen(true)
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-space-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              >
                <Bug className="w-4 h-4 text-amber-500" />
                <span>Report Bug</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
