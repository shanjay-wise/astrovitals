import React, { useState, useEffect } from 'react'
import {
  Sliders, X, Play, RotateCcw, Flame, Wind,
  AlertTriangle, Droplets, Moon, Brain, ShieldAlert, CheckCircle2
} from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'

const SCENARIOS = [
  {
    type: 'solar_flare',
    name: 'Solar Particle Event (SPE Storm)',
    icon: Flame,
    color: '#EF4444',
    description: 'Coronal mass ejection triggers massive solar proton flux (>2.5 mSv/hr). Forces crew retreat into Water-Wall Safe Haven.'
  },
  {
    type: 'co2_leak',
    name: 'ECLSS CDRA Bed Failure (CO₂ Leak)',
    icon: Wind,
    color: '#06B6D4',
    description: 'Molecular sieve bed saturation raises cabin ppCO₂ above 3.5 mmHg, inducing hypercapnia, compensatory tachypnea, and headaches.'
  },
  {
    type: 'cardiac_arrhythmia',
    name: 'Cardiac Arrhythmia & PACs',
    icon: AlertTriangle,
    color: '#F59E0B',
    description: 'Acute premature ventricular contractions and resting tachycardia (+30 bpm) triggered during microgravity EVA workload.'
  },
  {
    type: 'dehydration',
    name: 'Acute Hypovolemic Dehydration',
    icon: Droplets,
    color: '#3B82F6',
    description: 'Fluid loss reduces blood volume, dropping systolic pressure (<95 mmHg) and precipitating orthostatic intolerance.'
  },
  {
    type: 'sleep_deprivation',
    name: 'Severe Circadian Desynchronization',
    icon: Moon,
    color: '#8B5CF6',
    description: 'Persistent noise (>55 dBA) and 16 sunrises/day collapses sleep duration to 3.8 hrs, slowing PVT-B cognitive reaction.'
  },
  {
    type: 'isolation_stress',
    name: 'Long-Duration Confinement Stress',
    icon: Brain,
    color: '#EC4899',
    description: 'Distance-from-Earth psychological strain crashes HRV (<20 ms) and increases sympathetic nervous activation.'
  }
]

export default function MissionSimulatorModal({ isOpen, onClose }) {
  const {
    activeScenario,
    setActiveScenario,
    simulationSpeed,
    setSimulationSpeed,
    isDemoModeRunning,
    setDemoModeRunning
  } = useAstroStore()

  const [demoStep, setDemoStep] = useState(0)

  // 90-second scripted automated demo loop
  useEffect(() => {
    let timer
    if (isDemoModeRunning) {
      const demoSequence = [
        { scenario: SCENARIOS[0], duration: 15 }, // Solar flare
        { scenario: SCENARIOS[1], duration: 15 }, // CO2 leak
        { scenario: SCENARIOS[2], duration: 15 }, // Cardiac
        { scenario: SCENARIOS[3], duration: 15 }, // Dehydration
        { scenario: SCENARIOS[4], duration: 15 }, // Sleep
        { scenario: null, duration: 15 }          // Nominal resolution
      ]

      timer = setInterval(() => {
        setDemoStep((prev) => {
          const next = (prev + 1) % demoSequence.length
          setActiveScenario(demoSequence[next].scenario)
          return next
        })
      }, 15000)
    }

    return () => clearInterval(timer)
  }, [isDemoModeRunning, setActiveScenario])

  if (!isOpen) return null

  const handleStartDemo = () => {
    setDemoModeRunning(true)
    setActiveScenario(SCENARIOS[0])
    setSimulationSpeed(10)
    setDemoStep(0)
  }

  const handleStopDemo = () => {
    setDemoModeRunning(false)
    setActiveScenario(null)
    setSimulationSpeed(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-nasa-blue to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-white" />
            <div>
              <h2 className="heading-display text-base font-bold">MISSION SCENARIO & SPEED SIMULATOR</h2>
              <p className="text-xs text-blue-200">Inject spaceflight emergencies for judges' interactive review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Time Acceleration Control */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Time Acceleration Engine
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[1, 10, 60].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    simulationSpeed === speed
                      ? 'bg-nasa-blue text-white border-nasa-blue shadow-md'
                      : 'border-gray-200 dark:border-space-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-space-800'
                  }`}
                >
                  {speed}x REALTIME
                </button>
              ))}
            </div>
          </div>

          {/* Scripted 90-Second Demo Button */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-nasa-blue/10 border border-purple-500/30 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">SCRIPTED 90-SEC JUDGES' DEMO</span>
                {isDemoModeRunning && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500 text-white animate-pulse">
                    RUNNING (STEP {demoStep + 1}/6)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Automatically sequences through all 5 medical emergencies, changing suit nodes, charts, alerts, and AI bubble.
              </p>
            </div>

            {isDemoModeRunning ? (
              <button
                onClick={handleStopDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Stop Demo
              </button>
            ) : (
              <button
                onClick={handleStartDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Demo Mode</span>
              </button>
            )}
          </div>

          {/* Emergency Scenarios Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Manual Scenario Injections
              </h4>
              {activeScenario && (
                <button
                  onClick={() => setActiveScenario(null)}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear Active Scenario
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SCENARIOS.map((scen) => {
                const Icon = scen.icon
                const isActive = activeScenario?.type === scen.type
                return (
                  <button
                    key={scen.type}
                    onClick={() => setActiveScenario(isActive ? null : scen)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-400'
                        : 'border-gray-200 dark:border-space-700 hover:bg-gray-50 dark:hover:bg-space-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="p-1 rounded-md"
                        style={{ backgroundColor: `${scen.color}20`, color: scen.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {scen.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                      {scen.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 dark:bg-space-800 border-t border-gray-200 dark:border-space-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gray-200 dark:bg-space-700 hover:bg-gray-300 dark:hover:bg-space-600 text-gray-800 dark:text-gray-200"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  )
}
