import React, { useState } from 'react'
import { Dumbbell, Activity, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'
import { generateMuscleTrend, generateExerciseLog } from '../../data/activityData'

export default function MusculoskeletalTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('mission')

  const boneDensity = currentVitals?.boneDensity || currentAstro.baselines.boneDensity
  const muscleMass = currentVitals?.muscleMass || currentAstro.baselines.muscleMass

  const muscleTrend = generateMuscleTrend()
  const exerciseLog = generateExerciseLog()

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-emerald-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              MUSCULOSKELETAL & EXERCISE COUNTERMEASURES
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • ARED Resistive Load, T2 Treadmill, Bone Mineral Density (BMD) & Muscle Cross-Sectional Area
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
          <span className="text-[10px] text-gray-400 font-bold uppercase">Bone Density Retained</span>
          <p className={`mono-data text-2xl font-extrabold mt-1 ${boneDensity < 92 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {boneDensity}%
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">DXA Calcaneus & Lumbar Spine</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Muscle Volume Retained</span>
          <p className={`mono-data text-2xl font-extrabold mt-1 ${muscleMass < 90 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
            {muscleMass}%
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Soleus & Gastrocnemius Mass</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Daily Exercise Logged</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            2.3 <span className="text-xs font-normal text-gray-400">/ 2.5 hrs</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">ARED + T2 COLBERT + CEVIS</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">VO₂ Max Aerobic Capacity</span>
          <p className="mono-data text-2xl font-extrabold text-purple-500 mt-1">
            44.2 <span className="text-xs font-normal text-gray-400">mL/kg/min</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Nominal cardiorespiratory fitness</p>
        </div>
      </div>

      {/* Chart: 20-Week Muscle Mass Retention with NASA Reference Band */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            20-WEEK MUSCLE RETENTION PROFILE WITH NASA TARGET BAND (90% - 100%)
          </h3>
          <span className="status-nominal">ARED COUNTERMEASURE ACTIVE</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Shows progressive upper and lower body muscle cross-sectional area against the NASA-STD-3001 mitigation threshold (&gt;90% baseline).
        </p>
        <ReferenceBandChart
          data={muscleTrend}
          dataKey="lower"
          timeKey="week"
          color="#10B981"
          unit="%"
          referenceMin={90}
          referenceMax={100}
          referenceLabel="NASA Retention Target (>90%)"
          domain={[80, 105]}
          height={260}
        />
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-emerald-500" />
            <span>Status Explanation: Microgravity Osteoclast Demineralization</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Without skeletal weight-bearing loads in microgravity, osteoblast bone formation drops while osteoclast resorption increases. Astronauts lose approximately 1.0% to 1.5% of bone mineral density per month in load-bearing bones (femoral neck, lumbar vertebrae, calcaneus). Calcium released into the bloodstream elevates the risk of renal kidney stones.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            To prevent severe osteopenia and preserve strength for Mars gravitational touchdown, astronauts must complete 2.5 hours of daily mandatory exercise: high-load squats and deadlifts up to 600 lbf on the Advanced Resistive Exercise Device (ARED), accompanied by bungee-harnessed running on the T2 vibration-isolated treadmill.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 1 §4.5 (Musculoskeletal Fitness & Bone Mineral Maintenance)</span>
        <a
          href="https://www.nasa.gov/hrp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Exercise Countermeasures Project <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
