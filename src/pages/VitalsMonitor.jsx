import { useState, useEffect } from 'react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  HeartPulse, Thermometer, Wind, Droplets, Activity,
  AlertTriangle, ShieldCheck, Info, CheckCircle2, RefreshCw
} from 'lucide-react'
import { useCrew } from '../context/CrewContext'
import { useTheme } from '../context/ThemeContext'
import { vitalsConfig, generateECGData, generateHRTrend, generateSpO2Trend, generateBPTrend } from '../data/vitalsData'
import { nasaStandards } from '../data/nasaStandardsData'
import GaugeChart from '../components/GaugeChart'

export default function VitalsMonitor() {
  const { currentMember } = useCrew()
  const { darkMode } = useTheme()
  const [ecgData, setEcgData] = useState(() => generateECGData(200))
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  const vitals = vitalsConfig[currentMember.id] || vitalsConfig['cmd-01']
  const hrTrend = generateHRTrend(vitals.heartRate.current)
  const spo2Trend = generateSpO2Trend(vitals.spO2.current)
  const bpTrend = generateBPTrend(vitals.bloodPressure.systolic, vitals.bloodPressure.diastolic)

  // Real-time dynamic ECG update
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgData(generateECGData(200))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // SANS & Fluid shift risk estimation based on microgravity days & BP
  const sansRiskScore = currentMember.status === 'warning' ? 68 : 24
  const orthostaticIntoleranceRisk = currentMember.status === 'warning' ? 'Moderate (Class II)' : 'Low (Class I)'

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">CARDIAC & VITALS TELEMETRY</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
              NASA-STD-3001 VOL 1 COMPLIANT
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Biomedical telemetry streamed via Deep Space Network • Subject: {currentMember.name} ({currentMember.role})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['6h', '12h', '24h', '7d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-nasa-blue text-white dark:bg-blue-600'
                  : 'bg-gray-100 dark:bg-space-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-space-600'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Live ECG Telemetry Monitor */}
      <div className="card border-t-4 border-t-red-500">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 animate-pulse">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="heading-display text-base text-gray-900 dark:text-white">LEAD-II SURFACE ECG</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  REALTIME SYNCHRONIZED
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bio-Harness Electrodes 1-4 • 500 Hz Sample Rate</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-gray-100 dark:bg-space-600 px-3 py-1.5 rounded-lg">
              <span className="text-gray-400">PR: </span>
              <span className="mono-data font-bold text-gray-900 dark:text-white">142 ms</span>
            </div>
            <div className="bg-gray-100 dark:bg-space-600 px-3 py-1.5 rounded-lg">
              <span className="text-gray-400">QRS: </span>
              <span className="mono-data font-bold text-gray-900 dark:text-white">88 ms</span>
            </div>
            <div className="bg-gray-100 dark:bg-space-600 px-3 py-1.5 rounded-lg">
              <span className="text-gray-400">QTc: </span>
              <span className="mono-data font-bold text-gray-900 dark:text-white">412 ms</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg font-bold mono-data text-sm">
              {vitals.heartRate.current} BPM
            </div>
          </div>
        </div>

        <div className="h-44 w-full bg-space-900/5 dark:bg-space-900/70 rounded-xl p-2 border border-gray-100 dark:border-space-600/40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ecgData}>
              <defs>
                <linearGradient id="ecgVitalsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
              <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2.5} fill="url(#ecgVitalsGradient)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Primary Vitals 6-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Metric 1: Heart Rate */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Heart Rate</h4>
                <p className="text-[11px] text-gray-500">Baseline: 60-85 BPM</p>
              </div>
            </div>
            <span className={`status-${vitals.heartRate.status}`}>
              {vitals.heartRate.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.heartRate.current}
            </span>
            <span className="text-xs font-semibold text-gray-400">BPM</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            24h Range: {vitals.heartRate.min} - {vitals.heartRate.max} BPM
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            NASA standard limit for nominal crew rest: &lt;90 BPM
          </div>
        </div>

        {/* Metric 2: Blood Pressure */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Blood Pressure</h4>
                <p className="text-[11px] text-gray-500">Brachial Cuff Sphygmo</p>
              </div>
            </div>
            <span className={`status-${vitals.bloodPressure.status}`}>
              {vitals.bloodPressure.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
            </span>
            <span className="text-xs font-semibold text-gray-400">mmHg</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Mean Arterial Pressure (MAP): {Math.round((vitals.bloodPressure.systolic + 2 * vitals.bloodPressure.diastolic) / 3)} mmHg
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            Cephalic fluid shift: +1.8 L volume redistribution
          </div>
        </div>

        {/* Metric 3: Oxygen Saturation */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Peripheral SpO₂</h4>
                <p className="text-[11px] text-gray-500">Pulse Oximetry Sensor</p>
              </div>
            </div>
            <span className={`status-${vitals.spO2.status}`}>
              {vitals.spO2.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.spO2.current}
            </span>
            <span className="text-xs font-semibold text-gray-400">%</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Cabin Partial Pressure O₂: 155 mmHg (20.9%)
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            NASA Permissible Min: 95.0% at 14.7 psi
          </div>
        </div>

        {/* Metric 4: Core Temperature */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-500">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Core Body Temp</h4>
                <p className="text-[11px] text-gray-500">Thermo-pill telemetry</p>
              </div>
            </div>
            <span className={`status-${vitals.temperature.status}`}>
              {vitals.temperature.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.temperature.current}
            </span>
            <span className="text-xs font-semibold text-gray-400">°C</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Circadian Peak: {(vitals.temperature.current + 0.3).toFixed(1)}°C ("Space Fever")
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            Microgravity suppresses natural evaporative heat dissipation
          </div>
        </div>

        {/* Metric 5: Respiratory Rate */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Respiration Rate</h4>
                <p className="text-[11px] text-gray-500">Transthoracic impedance</p>
              </div>
            </div>
            <span className={`status-${vitals.respiratoryRate.status}`}>
              {vitals.respiratoryRate.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.respiratoryRate.current}
            </span>
            <span className="text-xs font-semibold text-gray-400">br/min</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Tidal Volume: ~520 mL • Minute Ventilation: 8.3 L/min
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            Nominal resting astronaut range: 12 - 18 br/min
          </div>
        </div>

        {/* Metric 6: Heart Rate Variability */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">HRV (RMSSD)</h4>
                <p className="text-[11px] text-gray-500">Autonomic Tone Index</p>
              </div>
            </div>
            <span className={`status-${vitals.hrv.status}`}>
              {vitals.hrv.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.hrv.current}
            </span>
            <span className="text-xs font-semibold text-gray-400">ms</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Parasympathetic modulation index: {vitals.hrv.current > 40 ? 'Healthy' : 'Depressed'}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            Values &lt;30 ms trigger fatigue & stress protocol alert
          </div>
        </div>
      </div>

      {/* NASA Spaceflight Syndromes & Clinical Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SANS Risk Analysis */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${sansRiskScore > 50 ? 'text-amber-500' : 'text-emerald-500'}`} />
              <h3 className="heading-display text-sm text-gray-900 dark:text-white">
                SANS RISK EVALUATION (NASA HRP)
              </h3>
            </div>
            <span className={`status-${sansRiskScore > 50 ? 'warning' : 'nominal'}`}>
              {sansRiskScore > 50 ? 'ELEVATED RISK' : 'LOW RISK'}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Spaceflight-Associated Neuro-ocular Syndrome (SANS): Optic disc edema, globe flattening, and hyperopic shifts caused by sustained cephalad venous congestion.
          </p>
          <div className="flex items-center gap-6">
            <GaugeChart value={sansRiskScore} max={100} size={90} strokeWidth={9} color="#F59E0B" label="SANS Risk" unit="%" />
            <div className="space-y-1.5 text-xs">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">OCT Retinal Nerve Fiber Layer: </span>
                {sansRiskScore > 50 ? '+14 µm thickening (Grade 1)' : 'Nominal thickness'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Intraocular Pressure (IOP): </span>
                {sansRiskScore > 50 ? '19 mmHg (Borderline)' : '14 mmHg (Nominal)'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Recommended Countermeasure: </span>
                {sansRiskScore > 50 ? 'Chibisov LBNP Suit 50 mmHg session' : 'Routine Fundoscopy at Day 160'}
              </p>
            </div>
          </div>
        </div>

        {/* Orthostatic Intolerance Assessment */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-nasa-blue dark:text-blue-400" />
              <h3 className="heading-display text-sm text-gray-900 dark:text-white">
                ORTHOSTATIC READINESS
              </h3>
            </div>
            <span className={`status-${currentMember.status === 'warning' ? 'warning' : 'nominal'}`}>
              {orthostaticIntoleranceRisk}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Assesses cardiovascular re-adaptation readiness for Mars / Earth gravity vector transition after prolonged deconditioning.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-space-600/40">
              <span className="text-gray-500 dark:text-gray-400">Plasma Volume Loss:</span>
              <span className="mono-data font-semibold text-gray-900 dark:text-white">-12.4% (Compensated)</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-space-600/40">
              <span className="text-gray-500 dark:text-gray-400">Baroreflex Sensitivity:</span>
              <span className="mono-data font-semibold text-gray-900 dark:text-white">12 ms/mmHg (Adequate)</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-space-600/40">
              <span className="text-gray-500 dark:text-gray-400">Fluid Loading Protocol:</span>
              <span className="mono-data font-semibold text-emerald-500">Scheduled T-48h pre-landing (1.0 L saline)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Biomedical Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Heart Rate 24h Trend */}
        <div className="card">
          <h3 className="heading-display text-sm text-gray-900 dark:text-white mb-2">
            24-HOUR HEART RATE VARIATION (BPM)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Demonstrates circadian rhythmicity and exercise spikes on COLBERT / ARED
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hrTrend}>
                <defs>
                  <linearGradient id="hrTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} />
                <YAxis domain={[45, 125]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit=" bpm" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="hr" stroke="#EF4444" strokeWidth={2} fill="url(#hrTrendGrad)" name="Heart Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure 24h Trend */}
        <div className="card">
          <h3 className="heading-display text-sm text-gray-900 dark:text-white mb-2">
            24-HOUR HEMODYNAMICS (SYSTOLIC / DIASTOLIC)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Arterial pressure profile during wake and sleep cycles
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} />
                <YAxis domain={[50, 150]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit=" mmHg" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="systolic" stroke="#3B82F6" strokeWidth={2} dot={false} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#06B6D4" strokeWidth={2} dot={false} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-500" /> Systolic
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-cyan-500" /> Diastolic
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
