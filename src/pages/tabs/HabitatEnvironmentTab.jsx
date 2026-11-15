import React, { useState } from 'react'
import { Home, Wind, Droplets, Volume2, Gauge, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'

export default function HabitatEnvironmentTab() {
  const { currentVitals } = useAstroStore()
  const [trendRange, setTrendRange] = useState('24h')

  const co2Level = currentVitals?.cabinCO2 || 2.1

  // 24h CO2 trend
  const co2Trend = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    co2: parseFloat((co2Level + Math.sin(i / 12 * Math.PI) * 0.4 + (Math.random() - 0.5) * 0.15).toFixed(2))
  }))

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-sky-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              HABITAT ENVIRONMENT & ECLSS LIFE SUPPORT
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Orion / ISS Exploration Class Atmospheric Telemetry, Acoustic Noise & Pressure
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

      {/* KPI Cards: 6 Key Habitat Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Cabin ppCO₂</span>
          <p className={`mono-data text-xl font-extrabold mt-1 ${co2Level > 3.0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {co2Level} <span className="text-xs font-normal text-gray-400">mmHg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">NASA Limit: &lt;3.0</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Cabin ppO₂</span>
          <p className="mono-data text-xl font-extrabold text-blue-500 mt-1">
            155 <span className="text-xs font-normal text-gray-400">mmHg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">20.9% sea-level eq</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Total Pressure</span>
          <p className="mono-data text-xl font-extrabold text-gray-900 dark:text-white mt-1">
            14.7 <span className="text-xs font-normal text-gray-400">psia</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">101.3 kPa nominal</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Acoustic Noise</span>
          <p className="mono-data text-xl font-extrabold text-emerald-500 mt-1">
            48.2 <span className="text-xs font-normal text-gray-400">dBA</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Sleep Spec: &lt;52 dBA</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Relative Humidity</span>
          <p className="mono-data text-xl font-extrabold text-cyan-500 mt-1">
            44.8%
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">NASA Spec: 35-60%</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Air Temperature</span>
          <p className="mono-data text-xl font-extrabold text-amber-500 mt-1">
            21.6 <span className="text-xs font-normal text-gray-400">°C</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">70.8°F thermal zone</p>
        </div>
      </div>

      {/* Chart: 24h Cabin CO2 with NASA-STD-3001 Limit Band */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            24-HOUR CABIN ppCO₂ (mmHg) WITH NASA-STD-3001 CEILING (&lt;3.0 mmHg)
          </h3>
          <span className="status-nominal">CDRA MOLECULAR SIEVE ACTIVE</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Shaded green region represents permissible cabin CO₂ partial pressure. Exceeding 3.0 mmHg triggers automated alert.
        </p>
        <ReferenceBandChart
          data={co2Trend}
          dataKey="co2"
          timeKey="time"
          color="#38BDF8"
          unit="mmHg"
          referenceMin={0}
          referenceMax={3.0}
          referenceLabel="NASA Permissible Limit (<3.0 mmHg)"
          domain={[0, 4.5]}
          height={260}
        />
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-sky-500" />
            <span>Status Explanation: Closed-Loop Environmental Control (ECLSS)</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            The closed spacecraft ecosystem recycles air and water: Carbon Dioxide Removal Assemblies (CDRA) use synthetic zeolite beds to scrub human metabolic CO₂, the Oxygen Generation Assembly (OGA) electrolyzes recycled water, and the Sabatier reactor combines CO₂ and H₂ to regenerate water and methane.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Continuous acoustic exposure from avionics cooling fans and life support pumps must remain below 52 dBA in sleep stations to prevent cognitive impairment and high-frequency hearing loss. If CDRA beds saturate and ppCO₂ rises above 3.5 mmHg, secondary LiOH lithium hydroxide canisters are deployed.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 2 §6 (Habitation & Environmental Health)</span>
        <a
          href="https://www.nasa.gov/eclss"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA ECLSS Engineering Specs <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
