import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Bell, ChevronDown, Rocket } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCrew } from '../context/CrewContext'
import { getAlertCounts } from '../data/alertsData'

export default function Header() {
  const navigate = useNavigate()
  const { darkMode, toggleTheme } = useTheme()
  const { currentMember, crewMembers, setSelectedCrew } = useCrew()
  const [crewOpen, setCrewOpen] = useState(false)
  const dropdownRef = useRef(null)
  const alertCounts = getAlertCounts()

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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-space-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-space-600">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nasa-blue to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="heading-display text-lg text-gray-900 dark:text-white group-hover:text-nasa-blue dark:group-hover:text-blue-400 transition-colors">
              ASTROVITALS
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-medium">
              Proxyma Dynamics • NASA Space Apps
            </p>
          </div>
        </div>

        {/* Mission Day */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-space-700 rounded-xl">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mission Day</span>
          <span className="mono-data text-lg font-bold text-nasa-blue dark:text-blue-400">{currentMember.missionDay}</span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Crew Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCrewOpen(!crewOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-space-700 hover:bg-gray-200 dark:hover:bg-space-600 transition-colors"
            >
              <span className="text-xl">{currentMember.avatar}</span>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{currentMember.name.split(' ').slice(1).join(' ')}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{currentMember.role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${crewOpen ? 'rotate-180' : ''}`} />
            </button>

            {crewOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-space-700 rounded-2xl shadow-2xl border border-gray-200 dark:border-space-600 overflow-hidden">
                <div className="p-2">
                  {crewMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => { setSelectedCrew(member.id); setCrewOpen(false) }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                        member.id === currentMember.id
                          ? 'bg-nasa-blue/10 dark:bg-nasa-blue/20'
                          : 'hover:bg-gray-100 dark:hover:bg-space-600'
                      }`}
                    >
                      <span className="text-2xl">{member.avatar}</span>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        member.status === 'nominal' ? 'bg-status-nominal' :
                        member.status === 'warning' ? 'bg-status-warning' : 'bg-status-critical'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Alerts */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-space-700 hover:bg-gray-200 dark:hover:bg-space-600 transition-colors"
            aria-label="View alerts"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {alertCounts.active > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-warning text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {alertCounts.active}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-space-700 hover:bg-gray-200 dark:hover:bg-space-600 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
