import React, { useState } from 'react'
import { HeartPulse, Activity, ShieldCheck, AlertCircle, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'
import { generateHRTrend, generateECGData } from '../../data/vitalsData'
import { AreaChart, Area, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function CardiovascularTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('24h')

  const hrTrend = generateHRTrend(currentVitals?.hr || currentAstro.baselines.hr)
  const ecgData = generateECGData(200)

  return (
    <div className="space-y-6">
      {/* Title & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-red-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              CARDIOVASCULAR & HEMODYNAMICS
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Bio-Harness Lead-II Electrocardiogram & Arterial Pressure
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-space-800 p-1 rounded-xl border border-gray-200 dark:border-space-700 self-start sm:self-auto">
          {['24h', '7d', 'mission'].map((range) => (
            <button
              key={range}
              onClick={() => setTrendRange(range)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center ${
                trendRange === range
                  ? 'bg-nasa-blue text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Current Pulse</span>
          <p className="mono-data text-2xl font-extrabold text-red-500 mt-1">
            {currentVitals?.hr || currentAstro.baselines.hr} <span className="text-xs font-normal text-gray-400">bpm</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Baseline: {currentAstro.baselines.hr} bpm</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Blood Pressure</span>
          <p className="mono-data text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {currentVitals?.bpSys || currentAstro.baselines.bpSys}/{currentVitals?.bpDia || currentAstro.baselines.bpDia} <span className="text-xs font-normal text-gray-400">mmHg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">MAP: {Math.round(((currentVitals?.bpSys || 118) + 2 * (currentVitals?.bpDia || 76)) / 3)} mmHg</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Heart Rate Var. (RMSSD)</span>
          <p className="mono-data text-2xl font-extrabold text-purple-500 mt-1">
            {currentVitals?.hrv || currentAstro.baselines.hrv} <span className="text-xs font-normal text-gray-400">ms</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Autonomic Tone Index</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Stroke Volume Proxy</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            72 <span className="text-xs font-normal text-gray-400">mL/beat</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Cardiac Output: ~5.1 L/min</p>
        </div>
      </div>

      {/* Main Chart with Shaded NASA Reference Range */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            HEART RATE TELEMETRY TREND WITH NASA REFERENCE BAND (60 - 85 BPM)
          </h3>
          <span className="status-nominal">NASA-STD-3001 VOL 1</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Green shaded region indicates normal resting spaceflight cardiovascular target band.
        </p>
        <ReferenceBandChart
          data={hrTrend}
          dataKey="hr"
          timeKey="time"
          color="#EF4444"
          unit="bpm"
          referenceMin={60}
          referenceMax={85}
          referenceLabel="NASA Nominal Band (60-85)"
          domain={[40, 120]}
          height={260}
        />
      </div>

      {/* Live ECG Waveform */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
            <h4 className="heading-display text-xs font-bold text-gray-900 dark:text-white">
              REAL-TIME LEAD-II SURFACE ELECTROCARDIOGRAM
            </h4>
          </div>
          <span className="text-[10px] mono-data text-emerald-500 font-semibold">QRS: 86 ms • PR: 144 ms</span>
        </div>
        <div className="h-28 w-full bg-space-950/5 dark:bg-space-950/70 rounded-lg p-1 border border-gray-100 dark:border-space-800">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ecgData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#263859" opacity={0.3} />
              <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} fill="#EF444420" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Meaning & Flight Surgeon Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-nasa-blue dark:text-nasa-blueLight" />
            <span>Status Explanation: Cardiovascular Deconditioning</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            In microgravity, elimination of hydrostatic pressure gradients redirects approximately 1.5–2.0 liters of blood and interstitial fluid towards the head. Baroreceptors sense this as fluid overload, suppressing thirst and decreasing plasma volume by ~10–15% within the first 48 hours.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Upon re-entry into a gravity field (Mars or Earth), reduced plasma volume and impaired arterial baroreflex responsiveness trigger orthostatic intolerance. Mandatory countermeasures include 1.0 L saline oral rehydration pre-landing, lower body negative pressure (LBNP), and daily high-intensity aerobic CEVIS training.
          </p>
        </div>
      </div>

      {/* Verified NASA Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Verified NASA Standard: NASA-STD-3001 Vol 1 §4.2 (Cardiovascular & Hemodynamic Health)</span>
        <a
          href="https://www.nasa.gov/hrp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Human Research Program Evidence Book <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
