import React, { useState } from 'react'
import { Wind, Droplets, AlertTriangle, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'
import { generateSpO2Trend } from '../../data/vitalsData'

export default function RespiratoryTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('24h')

  const spo2Trend = generateSpO2Trend(currentVitals?.spo2 || currentAstro.baselines.spo2)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Wind className="w-6 h-6 text-cyan-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              RESPIRATORY & CABIN GAS EXCHANGE
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Pulse Oximetry, Ventilation Rate & Environmental CO₂ Exposure
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
          <span className="text-[10px] text-gray-400 font-bold uppercase">SpO₂ Oxygen Saturation</span>
          <p className="mono-data text-2xl font-extrabold text-cyan-500 mt-1">
            {currentVitals?.spo2 || currentAstro.baselines.spo2}%
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">NASA Permissible: &gt;95.0%</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Respiration Rate</span>
          <p className="mono-data text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {currentVitals?.resp || currentAstro.baselines.resp} <span className="text-xs font-normal text-gray-400">br/min</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Transthoracic impedance</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Cabin ppCO₂</span>
          <p className="mono-data text-2xl font-extrabold text-emerald-500 mt-1">
            {currentVitals?.cabinCO2 || 2.1} <span className="text-xs font-normal text-gray-400">mmHg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">CDRA scrubbed (&lt;3.0 mmHg)</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Minute Ventilation</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            7.8 <span className="text-xs font-normal text-gray-400">L/min</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Tidal volume ~520 mL</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            PULSE OXIMETRY (SpO₂) TREND WITH NASA STANDARD BAND (95% - 100%)
          </h3>
          <span className="status-nominal">ECLSS CABIN NOMINAL</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Green shaded band represents NASA-STD-3001 compliant oxygen saturation in 14.7 psi cabin atmosphere.
        </p>
        <ReferenceBandChart
          data={spo2Trend}
          dataKey="spo2"
          timeKey="time"
          color="#06B6D4"
          unit="%"
          referenceMin={95}
          referenceMax={100}
          referenceLabel="NASA Permissible SpO2 (>95%)"
          domain={[90, 100]}
          height={260}
        />
      </div>

      {/* Meaning & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-cyan-500" />
            <span>Status Explanation: Carbon Dioxide Sensitivity in Space</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            In microgravity, warm exhaled air does not rise via natural convection, creating stagnant localized CO₂ pockets around an astronaut's head during sleep. Even moderate elevated cabin ppCO₂ (&gt;3.0 mmHg) triggers hypercapnia headaches, irritability, and exacerbates Spaceflight-Associated Neuro-ocular Syndrome (SANS).
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Cabin ventilation fans must maintain continuous air flow across crew sleep quarters (&gt;0.1 m/s velocity). If SpO₂ drops below 94% or cabin ppCO₂ reaches 3.5 mmHg, automated alerts trigger secondary CDRA molecular bed desorb cycles and crew emergency oxygen masks.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 2 §6.2 (Cabin Atmosphere Quality & Respiratory Protections)</span>
        <a
          href="https://www.nasa.gov/hrp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA ECLSS Engineering Standards <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
