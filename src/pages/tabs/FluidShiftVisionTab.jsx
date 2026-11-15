import React, { useState } from 'react'
import { Eye, Activity, ShieldCheck, Info, ExternalLink, AlertTriangle } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'

export default function FluidShiftVisionTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('mission')

  // Retinal nerve fiber layer thickness (SANS marker) across 20 weeks
  const sansData = Array.from({ length: 20 }, (_, i) => {
    const week = `Wk ${i + 1}`
    const growth = i * 0.75 + (currentAstro.archetype === 'bone_muscle_loss' ? i * 0.4 : 0)
    return {
      week,
      thickness: parseFloat((95 + growth + (Math.random() - 0.5) * 1.5).toFixed(1))
    }
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-teal-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              CEPHALIC FLUID SHIFT & SANS VISION MONITOR
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Spaceflight-Associated Neuro-ocular Syndrome (SANS) & Optical Coherence Tomography (OCT)
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
          <span className="text-[10px] text-gray-400 font-bold uppercase">SANS Clinical Grade</span>
          <p className="mono-data text-2xl font-extrabold text-teal-500 mt-1">
            GRADE 0 <span className="text-xs font-normal text-gray-400">Nominal</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Optic disc edema absent</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Cephalic Fluid Shift</span>
          <p className="mono-data text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            +1.8 <span className="text-xs font-normal text-gray-400">Liters</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Head-ward fluid redistribution</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Intraocular Pressure (IOP)</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            15.4 <span className="text-xs font-normal text-gray-400">mmHg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Tonometer reading (Nominal &lt;21)</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">RNFL Retinal Thickness</span>
          <p className="mono-data text-2xl font-extrabold text-purple-500 mt-1">
            104 <span className="text-xs font-normal text-gray-400">µm</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">OCT Scan (+9 µm expansion)</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            RETINAL NERVE FIBER LAYER (RNFL) THICKNESS WITH SANS CAUTION BAND (&lt;120 µm)
          </h3>
          <span className="status-nominal">OCT TELEMETRY NOMINAL</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Monitors progressive optic disc expansion caused by sustained microgravity venous engorgement.
        </p>
        <ReferenceBandChart
          data={sansData}
          dataKey="thickness"
          timeKey="week"
          color="#14B8A6"
          unit="µm"
          referenceMin={90}
          referenceMax={120}
          referenceLabel="NASA Safe RNFL Band (<120 µm)"
          domain={[80, 135]}
          height={260}
        />
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-teal-500" />
            <span>Status Explanation: Spaceflight-Associated Neuro-ocular Syndrome</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            In microgravity, absence of downward gravity vectors prevents venous blood drainage from the cranium. Elevated jugular and central venous pressure increases optic nerve sheath diameter (ONSD), flattens the posterior globe of the eye, generates choroidal folds, and shifts focal length toward hyperopia (farsightedness) in up to 70% of long-duration astronauts.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Crew members undergo bi-weekly optical coherence tomography (OCT) fundoscopy exams. If RNFL thickness exceeds 120 µm or visual acuity degrades, daily sessions with the Russian Chibisov Lower Body Negative Pressure (LBNP) suit are prescribed to draw venous fluid back toward the lower limbs and relieve intracranial venous pressure.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 1 §4.6 & NASA SANS Clinical Practice Guidelines</span>
        <a
          href="https://www.nasa.gov/hrp/elements/sans"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA SANS Research Group <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
