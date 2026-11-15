import React, { useState } from 'react'
import { Droplets, Apple, Utensils, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'

export default function NutritionHydrationTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('7d')

  const hydration = currentVitals?.hydration || currentAstro.baselines.hydration

  // 7-day hydration trend
  const hydrationTrend = [
    { day: 'Day 141', level: 93.4 },
    { day: 'Day 142', level: 92.1 },
    { day: 'Day 143', level: 94.0 },
    { day: 'Day 144', level: 88.5 },
    { day: 'Day 145', level: 91.2 },
    { day: 'Day 146', level: 89.4 },
    { day: 'Day 147', level: parseFloat(hydration) }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-blue-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              NUTRITION, HYDRATION & METABOLISM
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Caloric Expenditure Balance, Fluid Homeostasis & Micronutrient Stability
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
          <span className="text-[10px] text-gray-400 font-bold uppercase">Hydration Index</span>
          <p className={`mono-data text-2xl font-extrabold mt-1 ${hydration < 80 ? 'text-amber-500' : 'text-blue-500'}`}>
            {hydration}%
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Target: &gt;85% bio-impedance</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Caloric Intake Today</span>
          <p className="mono-data text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            2,840 <span className="text-xs font-normal text-gray-400">kcal</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Burn: 2,750 kcal (+90 balance)</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Vitamin D3 Supplement</span>
          <p className="mono-data text-2xl font-extrabold text-amber-500 mt-1">
            800 <span className="text-xs font-normal text-gray-400">IU / day</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Bone matrix protection</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Body Mass Stability</span>
          <p className="mono-data text-2xl font-extrabold text-emerald-500 mt-1">
            {currentAstro.weightKg} <span className="text-xs font-normal text-gray-400">kg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">±0.4% from pre-flight mass</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            7-DAY HYDRATION PROFILE WITH NASA NOMINAL BAND (85% - 100%)
          </h3>
          <span className="status-nominal">BIO-IMPEDANCE TELEMETRY</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Green shaded band represents optimal intravascular hydration volume to prevent acute orthostatic hypotension upon gravity transition.
        </p>
        <ReferenceBandChart
          data={hydrationTrend}
          dataKey="level"
          timeKey="day"
          color="#3B82F6"
          unit="%"
          referenceMin={85}
          referenceMax={100}
          referenceLabel="NASA Nominal Hydration (>85%)"
          domain={[70, 105]}
          height={260}
        />
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Status Explanation: Nutrition and Renal Stone Risk</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            In microgravity, bone demineralization releases excess calcium into the blood, increasing urine calcium concentrations. Coupled with chronic voluntary hypohydration (astronauts often reduce water drinking due to work focus), the risk of calcium oxalate renal calculi (kidney stones) is markedly elevated during spaceflight.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Daily fluid intake must exceed 2.5 L of water processed through the Water Recovery System (WRS). Dietary sodium is strictly capped at &lt;3,000 mg/day, accompanied by 800 IU oral Vitamin D3, 1,200 mg calcium, and potassium citrate urine alkalinization protocols.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 1 §4.7 (Nutrition, Hydration & Metabolic Balance)</span>
        <a
          href="https://www.nasa.gov/hrp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Nutritional Biochemistry Lab <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
