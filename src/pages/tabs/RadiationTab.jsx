import React, { useState } from 'react'
import { RadioTower, ShieldAlert, Sun, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'
import SpaceWeatherWidget from '../../components/dashboard/SpaceWeatherWidget'
import { generateRadiationTrend } from '../../data/radiationData'

export default function RadiationTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('mission')

  const radiationRate = currentVitals?.radiationRate || 0.042
  const cumulativeDose = (145.2 + (currentAstro.archetype === 'radiation_alert' ? 48.0 : 0)).toFixed(1)
  const careerLimit = 600 // NASA modernized age/sex-neutral career limit (3% REID standard)
  const careerPct = ((cumulativeDose / careerLimit) * 100).toFixed(1)

  const trendData = generateRadiationTrend(radiationRate)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RadioTower className="w-6 h-6 text-amber-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              DEEP SPACE RADIATION & DOSIMETRY
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Galactic Cosmic Rays (GCR) & Solar Particle Event (SPE) Tissue Equivalent Dosimeters
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-space-800 p-1 rounded-xl border border-gray-200 dark:border-space-700 self-start sm:self-auto">
          {['24h', '7d', 'mission'].map((range) => (
            <button
              key={range}
              onClick={() => setTrendRange(range)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center ${
                trendRange === range ? 'bg-nasa-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Instantaneous Rate</span>
          <p className={`mono-data text-2xl font-extrabold mt-1 ${radiationRate > 0.15 ? 'text-red-500' : 'text-amber-500'}`}>
            {radiationRate} <span className="text-xs font-normal text-gray-400">mSv/h</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{(radiationRate * 1000).toFixed(0)} µSv/h TEPC Sensor</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Mission Cumulative Dose</span>
          <p className="mono-data text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {cumulativeDose} <span className="text-xs font-normal text-gray-400">mSv</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Day {currentAstro.missionDay} Absorbed</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">NASA Career Limit Cap</span>
          <p className="mono-data text-2xl font-extrabold text-emerald-500 mt-1">
            {careerPct}% <span className="text-xs font-normal text-gray-400">of 600 mSv</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">3% REID 95% Confidence</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Storm Shelter Status</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            {radiationRate > 2.0 ? 'ACTIVE EVAC' : 'STANDBY'}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Water-Wall Shield 45 g/cm²</p>
        </div>
      </div>

      {/* Real NASA DONKI Space Weather Widget */}
      <SpaceWeatherWidget />

      {/* Cumulative Trend Chart */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            CUMULATIVE DOSE TRAJECTORY (mSv) WITH NASA REID THRESHOLD
          </h3>
          <span className="status-nominal">ALARA PROTOCOL ACTIVE</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Shows progressive tissue equivalent dose absorption across Mars transit timeline against annual permissible cap (200 mSv/yr).
        </p>
        <ReferenceBandChart
          data={trendData}
          dataKey="cumulative"
          timeKey="day"
          color="#F59E0B"
          unit="mSv"
          referenceMin={0}
          referenceMax={200}
          referenceLabel="NASA Annual Transit Cap (200 mSv)"
          domain={[0, 250]}
          height={260}
        />
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-amber-500" />
            <span>Status Explanation: Deep Space Ionizing Radiation</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Beyond Earth's protective magnetosphere, astronauts face two ionizing radiation hazards: Galactic Cosmic Rays (GCR)—highly energetic relativistic atomic nuclei (HZE ions such as iron-56) that penetrate spacecraft hulls and cause complex clustered DNA double-strand breaks; and acute Solar Particle Events (SPE)—unpredictable coronal proton blasts.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            If SPE dosimeters register &gt;2.5 mSv/hr, the crew executes immediate retreat into the spacecraft's central storm shelter surrounded by 45 g/cm² of hydrogen-rich water and polyethylene shielding. Astronauts ingest prophylactic antioxidant cocktails (amifostine analogs, N-acetylcysteine) to scavenge free radicals and mitigate acute radiation syndrome.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 1 §4.3 (Radiation Protection Limits) & NASA Space Radiation Laboratory (NSRL)</span>
        <a
          href="https://www.nasa.gov/hrp/elements/radiation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Space Radiation Health Project <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
