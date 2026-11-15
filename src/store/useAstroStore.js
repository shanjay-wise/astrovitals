/**
 * AstroVitals Global Zustand Store
 * State management with localStorage persistence for astronaut profiles,
 * real-time telemetry, alerts, active scenarios, and UI settings.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { defaultAstronauts } from '../data/defaultAstronauts'
import { alertsData as initialAlerts } from '../data/alertsData'
import { telemetryEngine } from '../services/telemetryEngine'
import { computeHealthStatus } from '../services/healthScoring'

export const useAstroStore = create(
  persist(
    (set, get) => ({
      // Astronaut Profiles
      astronauts: defaultAstronauts,
      selectedAstronautId: defaultAstronauts[0].id,

      // UI & Theme
      darkMode: true,
      toggleDarkMode: () => {
        const next = !get().darkMode
        set({ darkMode: next })
        if (next) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      // Settings
      settings: {
        soundEnabled: true,
        reducedMotion: false,
        units: 'metric',
        alertSoundVolume: 0.7,
        autoOpenAiOnAnomaly: true
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      // Modals
      isBugModalOpen: false,
      setBugModalOpen: (open) => set({ isBugModalOpen: open }),
      isSettingsModalOpen: false,
      setSettingsModalOpen: (open) => set({ isSettingsModalOpen: open }),
      isProfileModalOpen: false,
      setProfileModalOpen: (open, astronaut = null) => set({ isProfileModalOpen: open, editingAstronaut: astronaut }),
      editingAstronaut: null,
      isSimulatorModalOpen: false,
      setSimulatorModalOpen: (open) => set({ isSimulatorModalOpen: open }),

      // AI Assistant
      isAiBubbleOpen: false,
      setAiBubbleOpen: (open) => set({ isAiBubbleOpen: open }),
      aiPulseSeverity: null, // 'caution' | 'critical' | null
      setAiPulseSeverity: (sev) => set({ aiPulseSeverity: sev }),

      // Live Telemetry
      tickCount: 0,
      currentVitals: null,
      currentStatuses: null,
      currentHealthScore: 95,
      vitalsHistory: [],

      // Simulation & Scenarios
      simulationSpeed: 1, // 1x, 10x, 60x
      setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
      activeScenario: null, // e.g. { type: 'solar_flare', name: 'Solar Particle Storm', ... }
      setActiveScenario: (scenario) => {
        set({ activeScenario: scenario })
        // Immediately trigger tick to reflect scenario
        get().executeTelemetryTick()
      },
      isDemoModeRunning: false,
      setDemoModeRunning: (running) => set({ isDemoModeRunning: running }),

      // Alerts
      alerts: initialAlerts,
      acknowledgeAlert: (alertId) => {
        set((state) => {
          const nextAlerts = state.alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a)
          // Re-evaluate immediately
          const astro = state.astronauts.find(a => a.id === state.selectedAstronautId) || state.astronauts[0]
          const health = computeHealthStatus(astro, state.currentVitals, nextAlerts)
          return {
            alerts: nextAlerts,
            currentHealthScore: health.score,
            currentStatuses: health.statuses
          }
        })
      },
      dismissAlert: (alertId) => {
        set((state) => {
          const nextAlerts = state.alerts.filter(a => a.id !== alertId)
          const astro = state.astronauts.find(a => a.id === state.selectedAstronautId) || state.astronauts[0]
          const health = computeHealthStatus(astro, state.currentVitals, nextAlerts)
          return {
            alerts: nextAlerts,
            currentHealthScore: health.score,
            currentStatuses: health.statuses
          }
        })
      },
      addAlert: (alert) => {
        set((state) => {
          const nextAlerts = [alert, ...state.alerts]
          const astro = state.astronauts.find(a => a.id === state.selectedAstronautId) || state.astronauts[0]
          const health = computeHealthStatus(astro, state.currentVitals, nextAlerts)
          return {
            alerts: nextAlerts,
            currentHealthScore: health.score,
            currentStatuses: health.statuses
          }
        })
      },

      // Astronaut Actions (CRUD)
      selectAstronaut: (id) => {
        const astro = get().astronauts.find(a => a.id === id) || get().astronauts[0]
        const tick = telemetryEngine.generateTick(astro, get().tickCount, get().activeScenario, get().alerts)
        set({
          selectedAstronautId: id,
          currentVitals: tick.vitals,
          currentStatuses: tick.statuses,
          currentHealthScore: tick.healthScore
        })
      },

      addAstronaut: (astronautData) => set((state) => {
        const id = `astro-${Date.now().toString().slice(-4)}`
        const newAstro = {
          id,
          name: astronautData.name || 'New Astronaut',
          age: Number(astronautData.age) || 35,
          sex: astronautData.sex || 'female',
          heightCm: Number(astronautData.heightCm) || 170,
          weightKg: Number(astronautData.weightKg) || 68,
          role: astronautData.role || 'Mission Specialist',
          mission: astronautData.mission || 'Artemis VII',
          avatar: astronautData.avatar || '🧑‍🚀',
          bloodType: astronautData.bloodType || 'O+',
          missionDay: Number(astronautData.missionDay) || 147,
          baselines: astronautData.baselines || {
            hr: 70, hrv: 50, bpSys: 120, bpDia: 80, spo2: 98, resp: 15, coreTemp: 36.7, sleepHrs: 7.5, boneDensity: 100, muscleMass: 100, hydration: 95
          },
          archetype: 'custom',
          healthScore: 95,
          status: 'nominal',
          createdAt: new Date().toISOString()
        }
        return {
          astronauts: [...state.astronauts, newAstro],
          selectedAstronautId: id
        }
      }),

      updateAstronaut: (id, updatedFields) => set((state) => ({
        astronauts: state.astronauts.map(a => a.id === id ? { ...a, ...updatedFields } : a)
      })),

      deleteAstronaut: (id) => set((state) => {
        if (state.astronauts.length <= 1) return state // Keep at least one
        const remaining = state.astronauts.filter(a => a.id !== id)
        return {
          astronauts: remaining,
          selectedAstronautId: state.selectedAstronautId === id ? remaining[0].id : state.selectedAstronautId
        }
      }),

      resetToDefaultAstronauts: () => set({
        astronauts: defaultAstronauts,
        selectedAstronautId: defaultAstronauts[0].id,
        alerts: initialAlerts
      }),

      // Telemetry Engine Step Trigger
      executeTelemetryTick: () => {
        const state = get()
        const astro = state.astronauts.find(a => a.id === state.selectedAstronautId) || state.astronauts[0]
        const nextTickCount = state.tickCount + 1

        const result = telemetryEngine.generateTick(astro, nextTickCount, state.activeScenario, state.alerts)

        let nextAlerts = state.alerts
        // Check if new alerts were generated
        if (result.alerts && result.alerts.length > 0) {
          const freshAlerts = result.alerts.filter(
            newAlt => !state.alerts.some(existing => existing.message === newAlt.message && !existing.acknowledged)
          )
          if (freshAlerts.length > 0) {
            nextAlerts = [...freshAlerts, ...state.alerts]

            // Auto-trigger AI bubble pulse if enabled
            if (state.settings.autoOpenAiOnAnomaly) {
              const highestSeverity = freshAlerts.some(a => a.severity === 'critical') ? 'critical' : 'caution'
              set({
                isAiBubbleOpen: true,
                aiPulseSeverity: highestSeverity
              })
            }
          }
        }

        // Keep 24 history points
        const historyPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          hr: result.vitals.hr,
          spo2: result.vitals.spo2,
          bpSys: result.vitals.bpSys,
          bpDia: result.vitals.bpDia,
          coreTemp: result.vitals.coreTemp,
          radiation: result.vitals.radiationRate
        }

        const nextHistory = [...state.vitalsHistory.slice(-23), historyPoint]

        set({
          tickCount: nextTickCount,
          alerts: nextAlerts,
          currentVitals: result.vitals,
          currentStatuses: result.statuses,
          currentHealthScore: result.healthScore,
          vitalsHistory: nextHistory
        })
      }
    }),
    {
      name: 'astrovitals-state-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        astronauts: state.astronauts,
        selectedAstronautId: state.selectedAstronautId,
        darkMode: state.darkMode,
        settings: state.settings
      })
    }
  )
)

if (typeof window !== 'undefined') {
  window.useAstroStore = useAstroStore
}

