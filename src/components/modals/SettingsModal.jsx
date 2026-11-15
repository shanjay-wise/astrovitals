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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 rounded-2xl w-full max-w-md max-h-[calc(100dvh-2.5rem)] my-auto flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-nasa-blue to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Settings className="w-5 h-5 shrink-0" />
            <h3 className="heading-display text-xs sm:text-sm font-bold truncate">SYSTEM & DISPLAY SETTINGS</h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 text-blue-200 hover:text-white transition-colors shrink-0"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
          {/* Unit System */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-space-800 gap-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Unit System</p>
              <p className="text-[11px] text-gray-400">Metric (°C, mmHg, kg) vs Imperial</p>
            </div>
            <div className="flex bg-gray-200 dark:bg-space-700 rounded-xl p-1 shrink-0">
              <button
                onClick={() => updateSettings({ units: 'metric' })}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  settings.units === 'metric' ? 'bg-nasa-blue text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => updateSettings({ units: 'imperial' })}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  settings.units === 'imperial' ? 'bg-nasa-blue text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-space-800 gap-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Audio Alert Chimes</p>
              <p className="text-[11px] text-gray-400">Audio ping on critical bio-telemetry alerts</p>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl transition-colors shrink-0 ${
                settings.soundEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-gray-200 text-gray-400 dark:bg-space-700'
              }`}
              aria-label="Toggle sound"
            >
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* AI Auto-Open on Anomaly */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-space-800 cursor-pointer gap-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Auto-Expand AstroAI on Anomaly</p>
              <p className="text-[11px] text-gray-400">Pops assistant panel when a critical alert triggers</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoOpenAiOnAnomaly}
              onChange={(e) => updateSettings({ autoOpenAiOnAnomaly: e.target.checked })}
              className="accent-nasa-blue w-6 h-6 rounded cursor-pointer shrink-0"
            />
          </label>

          {/* Reduced Motion */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-space-800 cursor-pointer gap-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Reduced Motion Mode</p>
              <p className="text-[11px] text-gray-400">Suppresses animations for accessibility (WCAG AA)</p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="accent-nasa-blue w-6 h-6 rounded cursor-pointer shrink-0"
            />
          </label>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-gray-100 dark:border-space-800 flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Reset Astronaut Profiles</p>
              <p className="text-[11px] text-gray-400">Restore 4 original NASA archetypes</p>
            </div>
            <button
              onClick={() => { resetToDefaultAstronauts(); onClose(); }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-gray-50 dark:bg-space-800 border-t border-gray-200 dark:border-space-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-nasa-blue text-white hover:bg-blue-700 flex items-center justify-center transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
