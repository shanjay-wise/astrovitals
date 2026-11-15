import React from 'react'
import { Settings, X, Volume2, VolumeX, Eye, Moon, Sun, RotateCcw } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'

export default function SettingsModal({ isOpen, onClose }) {
  const {
    settings,
    updateSettings,
    darkMode,
    toggleDarkMode,
    resetToDefaultAstronauts
  } = useAstroStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-nasa-blue to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h3 className="heading-display text-sm font-bold">SYSTEM & DISPLAY SETTINGS</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Unit System */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-space-800">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Unit System</p>
              <p className="text-[10px] text-gray-400">Metric (°C, mmHg, kg) vs Imperial</p>
            </div>
            <div className="flex bg-gray-200 dark:bg-space-700 rounded-lg p-0.5">
              <button
                onClick={() => updateSettings({ units: 'metric' })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                  settings.units === 'metric' ? 'bg-nasa-blue text-white' : 'text-gray-500'
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => updateSettings({ units: 'imperial' })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                  settings.units === 'imperial' ? 'bg-nasa-blue text-white' : 'text-gray-500'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-space-800">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Audio Alert Chimes</p>
              <p className="text-[10px] text-gray-400">Audio ping on critical bio-telemetry alerts</p>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-2 rounded-lg transition-colors ${
                settings.soundEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-gray-200 text-gray-400 dark:bg-space-700'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* AI Auto-Open on Anomaly */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-space-800">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Auto-Expand AstroAI on Anomaly</p>
              <p className="text-[10px] text-gray-400">Pops assistant panel when a critical alert triggers</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoOpenAiOnAnomaly}
              onChange={(e) => updateSettings({ autoOpenAiOnAnomaly: e.target.checked })}
              className="accent-nasa-blue w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-space-800">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Reduced Motion Mode</p>
              <p className="text-[10px] text-gray-400">Suppresses animations for accessibility (WCAG AA)</p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="accent-nasa-blue w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-gray-100 dark:border-space-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Reset Astronaut Profiles</p>
              <p className="text-[10px] text-gray-400">Restore 4 original NASA archetypes</p>
            </div>
            <button
              onClick={() => { resetToDefaultAstronauts(); onClose(); }}
              className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-space-800 border-t border-gray-200 dark:border-space-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-nasa-blue text-white hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
