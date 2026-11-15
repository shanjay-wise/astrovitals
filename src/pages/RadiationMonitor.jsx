import { useState } from 'react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  RadioTower, Shield, AlertTriangle, Sun, Zap,
  Activity, Info, Compass, CheckCircle2, ShieldAlert
} from 'lucide-react'
import { useCrew } from '../context/CrewContext'
import { useTheme } from '../context/ThemeContext'
import { radiationConfig, generateRadiationTrend, generateSolarForecast } from '../data/radiationData'
import { nasaStandards } from '../data/nasaStandardsData'
import GaugeChart from '../components/GaugeChart'

export default function RadiationMonitor() {
  const { currentMember } = useCrew()
  const { darkMode } = useTheme()
  const radiation = radiationConfig[currentMember.id] || radiationConfig['cmd-01']
  const radiationTrend = generateRadiationTrend(radiation.dailyDose.current)
  const solarForecast = generateSolarForecast()

  const careerLimit = nasaStandards.radiation.careerLimitMsv
  const careerPct = ((radiation.cumulativeDose.current / careerLimit) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">SPACE RADIATION & DOSIMETRY</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              NASA REID &lt;3% STANDARD
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Galactic Cosmic Rays (GCR) & Solar Particle Event (SPE) dosimetric telemetry for {currentMember.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Storm Shelter: <strong>STANDBY (GREEN)</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Radiation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Cumulative Dose */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Career Cumulative</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Absorbed Dose</h3>
            </div>
            <span className={`status-${radiation.cumulativeDose.status}`}>
              {radiation.cumulativeDose.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {radiation.cumulativeDose.current}
            </span>
            <span className="text-xs font-semibold text-gray-400">mSv</span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
              <span>Career Permissible: {careerLimit} mSv</span>
              <span className="mono-data font-semibold">{careerPct}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-space-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  Number(careerPct) > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${careerPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Daily Dose Rate */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">24-Hour Influx</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Daily Dose Rate</h3>
            </div>
            <span className="status-nominal">NOMINAL GCR</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {radiation.dailyDose.current}
            </span>
            <span className="text-xs font-semibold text-gray-400">mSv/day</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Instantaneous Rate: <strong className="mono-data text-gray-800 dark:text-gray-200">{(radiation.doseRate.current * 1000).toFixed(1)} µSv/hr</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            Terrestrial average: ~0.008 mSv/day (120x lower)
          </div>
        </div>

        {/* Metric 3: Solar Weather Status */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Heliospheric Sensor</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Solar Particle Event</h3>
            </div>
            <span className="status-nominal">QUIET</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-emerald-500">
              LOW
            </span>
            <span className="text-xs font-semibold text-gray-400">Risk Index</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Proton Flux (&gt;10 MeV): <strong className="mono-data text-gray-800 dark:text-gray-200">0.4 pfu</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            NOAA Solar Radiation Scale: S0 (Below Threshold)
          </div>
        </div>

        {/* Metric 4: Shielding Effectiveness */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Active Defenses</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Hull Shielding</h3>
            </div>
            <span className="status-nominal">NOMINAL</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              20
            </span>
            <span className="text-xs font-semibold text-gray-400">g/cm² Al-eq</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Water Wall Buffer: <strong className="mono-data text-emerald-500">Active (45 g/cm²)</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            High-Z iron ion GCR attenuation: 38.5%
          </div>
        </div>
      </div>

      {/* NASA Space Radiation Laboratory (NSRL) Hazard Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cumulative Dose Over Mission Days */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="heading-display text-sm text-gray-900 dark:text-white">
              MISSION ACCUMULATED DOSE PROFILE (mSv)
            </h3>
            <span className="text-xs text-gray-400">Day 1 to 147</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Total ionizing radiation absorbed by tissue-equivalent proportional counter (TEPC)
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={radiationTrend}>
                <defs>
                  <linearGradient id="radCumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke={darkMode ? '#64748b' : '#94a3b8'} interval={2} />
                <YAxis tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit=" mSv" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="cumulative" stroke="#F59E0B" strokeWidth={2.5} fill="url(#radCumGrad)" name="Cumulative Dose" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Solar Forecast & Flare Risk */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="heading-display text-sm text-gray-900 dark:text-white">
              7-DAY HELIOSPHERIC FLUX PROJECTION
            </h3>
            <span className="text-xs text-emerald-500 font-semibold">No CME Inbound</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Simulated solar proton density and magnetic field intensity
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solarForecast.slice(0, 24)}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke={darkMode ? '#64748b' : '#94a3b8'} interval={4} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit=" pfu" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="protonDensity" stroke="#3B82F6" strokeWidth={2} dot={false} name="Proton Density" />
                <Line type="monotone" dataKey="flux" stroke="#EF4444" strokeWidth={2} dot={false} name="X-Ray Flux" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-blue-500" /> Proton Density</div>
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-red-500" /> Solar X-Ray Flux</div>
          </div>
        </div>
      </div>

      {/* NASA Safe Haven Storm Shelter Protocol */}
      <div className="card border-l-4 border-l-amber-500">
        <h3 className="heading-display text-sm text-gray-900 dark:text-white mb-2">
          SOLAR PARTICLE STORM SHELTER ("SAFE HAVEN") CONTINGENCY PROTOCOL
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Under NASA-STD-3001, any Solar Particle Event (SPE) exceeding 2.5 mSv/hr mandates immediate crew retreat into the central storm shelter constructed of surrounding potable water tanks and food stowage bags.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <span className="font-semibold text-gray-900 dark:text-white">Shelter Mass Column</span>
            <p className="text-gray-400 mt-1">Surrounded by 800L water tanks & polyethylene slabs providing &gt;45 g/cm² areal mass.</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <span className="font-semibold text-gray-900 dark:text-white">Emergency Radioprotectants</span>
            <p className="text-gray-400 mt-1">Antioxidant cocktails, amifostine analog, and granulocyte colony-stimulating factors (G-CSF) stocked.</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <span className="font-semibold text-gray-900 dark:text-white">Evacuation Threshold</span>
            <p className="text-gray-400 mt-1">Automated alert fires when GOES detects &gt;100 MeV protons at &gt;10 pfu flux.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
