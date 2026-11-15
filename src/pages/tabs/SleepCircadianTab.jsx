import React, { useState } from 'react'
import { Moon, Sun, Sparkles, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'

export default function SleepCircadianTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('7d')

  const sleepScore = currentVitals?.sleepScore || Math.round((currentAstro.baselines.sleepHrs / 8.0) * 100)
  const recordedHours = (sleepScore * 0.08).toFixed(1)
  const sleepDebt = Math.max(0, (8.0 * 7 - recordedHours * 7)).toFixed(1)

  const sleepStages = [
    { day: 'Day 141', deep: 1.6, rem: 1.8, light: 3.6, target: 8.0 },
    { day: 'Day 142', deep: 1.4, rem: 1.9, light: 3.9, target: 8.0 },
    { day: 'Day 143', deep: 1.8, rem: 2.1, light: 3.5, target: 8.0 },
    { day: 'Day 144', deep: 1.1, rem: 1.3, light: 3.2, target: 8.0 },
    { day: 'Day 145', deep: 1.5, rem: 1.8, light: 3.7, target: 8.0 },
    { day: 'Day 146', deep: 0.9, rem: 1.1, light: 2.8, target: 8.0 },
    { day: 'Day 147', deep: parseFloat((recordedHours * 0.22).toFixed(1)), rem: parseFloat((recordedHours * 0.26).toFixed(1)), light: parseFloat((recordedHours * 0.52).toFixed(1)), target: 8.0 }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-purple-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              SLEEP ARCHITECTURE & CIRCADIAN RHYTHMS
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Actigraphy Polysomnography & SSLA Dynamic Lighting Schedule
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
          <span className="text-[10px] text-gray-400 font-bold uppercase">Recorded Sleep (24h)</span>
          <p className="mono-data text-2xl font-extrabold text-purple-500 mt-1">
            {recordedHours} <span className="text-xs font-normal text-gray-400">hours</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Target: 8.0 hrs NASA Standard</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Sleep Efficiency</span>
          <p className="mono-data text-2xl font-extrabold text-emerald-500 mt-1">
            {Math.min(96, Math.round(sleepScore * 0.94))}%
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Time in bed vs sleep latency</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Cumulative Sleep Debt</span>
          <p className={`mono-data text-2xl font-extrabold mt-1 ${Number(sleepDebt) > 6 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
            {sleepDebt} <span className="text-xs font-normal text-gray-400">hrs</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Over rolling 7-day period</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">SSLA Light Spectrum</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            480 <span className="text-xs font-normal text-gray-400">nm</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Morning alerting blue wave</p>
        </div>
      </div>

      {/* Sleep Stages Bar Chart */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            7-DAY POLYSOMNOGRAPHY & SLEEP STAGE ARCHITECTURE
          </h3>
          <span className="status-nominal">TARGET: 8.0h / NIGHT</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Stacked sleep staging (Deep Slow-Wave Sleep, REM, Light Stage) against NASA 8.0h flight rule requirement.
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sleepStages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#263859" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#64748B" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#64748B" unit=" h" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1A2742', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="deep" stackId="a" fill="#1E6BFF" name="Deep (SWS)" />
              <Bar dataKey="rem" stackId="a" fill="#8B5CF6" name="REM (Dream)" />
              <Bar dataKey="light" stackId="a" fill="#06B6D4" name="Light Sleep" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-400">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-600" /> Deep Sleep</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500" /> REM Sleep</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-cyan-500" /> Light Sleep</div>
        </div>
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-purple-500" />
            <span>Status Explanation: Circadian Desynchronization in Space</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            In low Earth orbit or interplanetary transit, natural daylight cues are absent, with orbital sunrises occurring every 90 minutes. Astronauts routinely experience sleep fragmentation, micro-arousals from cabin ventilation acoustics (&gt;52 dBA), and a reduction in restorative slow-wave deep sleep.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Chronic sleep debt (&gt;5 hours accumulated) degrades psychomotor vigilance, slows emergency decision-making, and impairs fine motor docking control. Solid-State Light Assemblies (SSLA) enforce strict 24-hour circadian entrainment: high-energy blue-enriched spectrum (480nm) during morning shift and warm amber (&lt;2700K) 2 hours before bedtime.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 1 §4.4 (Sleep, Shiftwork, and Circadian Entrainment)</span>
        <a
          href="https://www.nasa.gov/hrp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Behavioral Health & Performance Roadmap <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
