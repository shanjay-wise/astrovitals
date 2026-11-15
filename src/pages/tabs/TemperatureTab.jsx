import React, { useState } from 'react'
import { Thermometer, Flame, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'

export default function TemperatureTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('24h')

  // Generate 24h temp trend
  const tempTrend = Array.from({ length: 24 }, (_, i) => {
    const hr = `${String(i).padStart(2, '0')}:00`
    const base = currentVitals?.coreTemp || currentAstro.baselines.coreTemp
    const circadian = Math.sin((i - 6) / 24 * 2 * Math.PI) * 0.35
    return {
      time: hr,
      core: parseFloat((base + circadian + (Math.random() - 0.5) * 0.08).toFixed(2)),
      skin: parseFloat((base - 2.8 + circadian * 0.5 + (Math.random() - 0.5) * 0.1).toFixed(2))
    }
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-6 h-6 text-amber-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              CORE TEMPERATURE & THERMOREGULATION
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Ingestible Telemetric Pill, Skin Heat Flux & "Space Fever" Tracking
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-space-800 p-1 rounded-lg border border-gray-200 dark:border-space-700 self-start sm:self-auto">
          {['24h', '7d', 'mission'].map((range) => (
            <button
              key={range}
              onClick={() => setTrendRange(range)}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors ${
                trendRange === range ? 'bg-nasa-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Core Body Temp</span>
          <p className="mono-data text-2xl font-extrabold text-amber-500 mt-1">
            {currentVitals?.coreTemp || currentAstro.baselines.coreTemp} <span className="text-xs font-normal text-gray-400">°C</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Telemetry Pill Sensor</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Skin Forehead Temp</span>
          <p className="mono-data text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {parseFloat(((currentVitals?.coreTemp || 36.7) - 2.6).toFixed(1))} <span className="text-xs font-normal text-gray-400">°C</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Double-sensor heat flux</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Thermal Stress Index</span>
          <p className="mono-data text-2xl font-extrabold text-emerald-500 mt-1">
            LOW <span className="text-xs font-normal text-gray-400">Index</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">LCVG Cooling Garment Nom</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Spaceflight Fever Offset</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            +0.85 <span className="text-xs font-normal text-gray-400">°C</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Over terrestrial rest baseline</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            24-HOUR CORE TEMPERATURE (WITH NASA REFERENCE BAND: 36.4°C - 37.3°C)
          </h3>
          <span className="status-nominal">CIRCADIAN RHYTHMICITY INTACT</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Shows continuous core temperature circadian cycle measured via gastrointestinal telemetric pill.
        </p>
        <ReferenceBandChart
          data={tempTrend}
          dataKey="core"
          timeKey="time"
          color="#F59E0B"
          unit="°C"
          referenceMin={36.4}
          referenceMax={37.3}
          referenceLabel="NASA Nominal Core Band (36.4 - 37.3°C)"
          domain={[35.8, 38.2]}
          height={260}
        />
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-amber-500" />
            <span>Status Explanation: The "Space Fever" Phenomenon</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            NASA and Charité-Universitätsmedizin Berlin studies documented that astronauts experience a persistent core body temperature elevation of approximately 1°C during spaceflight even at rest. This results from impaired evaporative sweat dissipation in microgravity and persistent systemic low-grade IL-6 cytokine inflammatory activation.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            During heavy EVA extravehicular activity or ARED workout sessions, core temp can rapidly exceed 40°C if cooling garment flows are insufficient. Active liquid cooling ventilation garments (LCVG) are dialed to regulate heat flux during exercise, and hydration electrolytes must be aggressively maintained.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Verified Study: Nature Scientific Reports (Stahn et al., "Increased core body temperature in astronauts during long-duration space missions")</span>
        <a
          href="https://www.nature.com/articles/s41598-017-15560-w"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          Read Published Paper <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
