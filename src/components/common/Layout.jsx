import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import AIAssistantBubble from '../ai/AIAssistantBubble'
import BugReportModal from '../modals/BugReportModal'
import SettingsModal from '../modals/SettingsModal'
import AstronautProfileModal from '../modals/AstronautProfileModal'
import MissionSimulatorModal from '../simulator/MissionSimulatorModal'
import SplashScreen from './SplashScreen'
import { useAstroStore } from '../../store/useAstroStore'
import { nasaApiService } from '../../services/nasaApi'

export default function Layout() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('astrovitals_splash_dismissed')
  })

  const {
    executeTelemetryTick,
    simulationSpeed,
    isBugModalOpen,
    setBugModalOpen,
    isSettingsModalOpen,
    setSettingsModalOpen,
    isProfileModalOpen,
    setProfileModalOpen,
    editingAstronaut,
    isSimulatorModalOpen,
    setSimulatorModalOpen
  } = useAstroStore()

  const [dataSource, setDataSource] = useState('LIVE NASA')

  // Real NASA DONKI check to label data source
  useEffect(() => {
    nasaApiService.getSolarFlares().then(res => {
      setDataSource(res.source === 'LIVE' ? 'LIVE NASA' : res.source === 'CACHED' ? 'CACHED NASA' : 'SIMULATED')
    }).catch(() => {
      setDataSource('SIMULATED')
    })
  }, [])

  // Telemetry Engine Interval - Throttled at 1 tick/sec, scaled with simulationSpeed
  useEffect(() => {
    // execute immediately on mount
    executeTelemetryTick()

    const intervalMs = Math.max(100, Math.floor(1000 / simulationSpeed))
    const interval = setInterval(() => {
      executeTelemetryTick()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [simulationSpeed, executeTelemetryTick])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-space-950 text-gray-900 dark:text-gray-100 transition-colors overflow-x-hidden">
      <Header dataSource={dataSource} />

      <div className="flex flex-1 min-w-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-[1700px] mx-auto w-full min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Persistent AI Health Assistant Floating Bubble */}
      <AIAssistantBubble />

      {/* Real NASA APOD Mission Splash Screen */}
      {showSplash && (
        <SplashScreen
          onDismiss={() => {
            sessionStorage.setItem('astrovitals_splash_dismissed', 'true')
            setShowSplash(false)
          }}
        />
      )}

      {/* Application Modals */}
      {isBugModalOpen && <BugReportModal isOpen={isBugModalOpen} onClose={() => setBugModalOpen(false)} />}
      {isSettingsModalOpen && <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />}
      {isProfileModalOpen && (
        <AstronautProfileModal
          isOpen={isProfileModalOpen}
          astronaut={editingAstronaut}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
      {isSimulatorModalOpen && (
        <MissionSimulatorModal
          isOpen={isSimulatorModalOpen}
          onClose={() => setSimulatorModalOpen(false)}
        />
      )}
    </div>
  )
}
