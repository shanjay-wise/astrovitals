import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Activity, Dumbbell, Flame, Heart, Zap,
  TrendingDown, TrendingUp, CheckCircle2, Clock, AlertTriangle
} from 'lucide-react'
import { useCrew } from '../context/CrewContext'
import { useTheme } from '../context/ThemeContext'
import { activityConfig, generateExerciseLog, generateMuscleTrend } from '../data/activityData'
import GaugeChart from '../components/GaugeChart'

export default function PhysicalActivity() {
  const { currentMember } = useCrew()
  const { darkMode } = useTheme()
  const activity = activityConfig[currentMember.id] || activityConfig['cmd-01']
  const exerciseLog = generateExerciseLog()
  const muscleTrend = generateMuscleTrend()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">PHYSICAL EXERCISE & COUNTERMEASURES</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              NASA ARED + T2 PROTOCOL
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Microgravity musculoskeletal degradation mitigation • Subject: {currentMember.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Daily Countermeasure Rule:</span>
          <span className="status-nominal">2.5 HOURS MANDATORY</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Daily Exercise Time */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Today's Regimen</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Exercise Duration</h3>
            </div>
            <span className={`status-${activity.dailyExercise.status}`}>
              {activity.dailyExercise.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {activity.dailyExercise.completed}
            </span>
            <span className="text-sm text-gray-400 font-semibold">/ {activity.dailyExercise.required} hrs</span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
              <span>Protocol Completion</span>
              <span className="mono-data font-semibold">
                {Math.round((activity.dailyExercise.completed / activity.dailyExercise.required) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-space-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-status-nominal rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((activity.dailyExercise.completed / activity.dailyExercise.required) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Active Caloric Burn */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Metabolic Output</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Energy Burned</h3>
            </div>
            <span className="status-nominal">NOMINAL</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {activity.caloriesBurned.current}
            </span>
            <span className="text-sm text-gray-400 font-semibold">/ {activity.caloriesBurned.target} kcal</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Metabolic Equivalent of Task (MET): <strong className="mono-data text-gray-800 dark:text-gray-200">7.8 METs</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            Balanced with 3,000 kcal dietary intake
          </div>
        </div>

        {/* Metric 3: Muscle Mass Retention */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Ultrasound Biometry</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Muscle Volume</h3>
            </div>
            <span className={`status-${activity.muscleMass.status}`}>
              {activity.muscleMass.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {activity.muscleMass.current}
            </span>
            <span className="text-sm text-gray-400 font-semibold">% Baseline</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Soleus / Gastrocnemius: <strong className="mono-data text-gray-800 dark:text-gray-200">{activity.muscleMass.trend}</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            ARED high-load squat preserves postural stability
          </div>
        </div>

        {/* Metric 4: Bone Mineral Density */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">DXA T-Score Proxy</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Bone Mineral Density</h3>
            </div>
            <span className={`status-${activity.boneDensity.status}`}>
              {activity.boneDensity.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {activity.boneDensity.current}
            </span>
            <span className="text-sm text-gray-400 font-semibold">% Pre-flight</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Rate: <strong className="mono-data text-gray-800 dark:text-gray-200">-0.6% / month (Mitigated)</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-space-600/40 text-[11px] text-gray-400">
            Untreated microgravity loss: ~1.0 - 1.5% / month
          </div>
        </div>
      </div>

      {/* NASA Countermeasure Hardware Equipment Status */}
      <div className="card">
        <h3 className="heading-display text-sm text-gray-900 dark:text-white mb-3">
          NASA ISS EXERCISE HARDWARE SUITE STATUS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ARED */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-200 dark:border-space-500/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">ARED</h4>
              </div>
              <span className="status-nominal">READY</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Advanced Resistive Exercise Device. Vacuum cylinders deliver constant resistance up to 600 lbf (2,670 N).
            </p>
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-space-500/30 flex justify-between text-xs">
              <span className="text-gray-400">Piston Seals:</span>
              <span className="mono-data font-semibold text-emerald-500">100% Hermetic</span>
            </div>
          </div>

          {/* T2 Treadmill */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-200 dark:border-space-500/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">T2 / COLBERT</h4>
              </div>
              <span className="status-nominal">READY</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Vibration Isolation Treadmill. Bungee harness applies 70-85% Earth body weight downforce during running.
            </p>
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-space-500/30 flex justify-between text-xs">
              <span className="text-gray-400">VIS Dampers:</span>
              <span className="mono-data font-semibold text-emerald-500">Zero Micro-vibe</span>
            </div>
          </div>

          {/* CEVIS */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-200 dark:border-space-500/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">CEVIS</h4>
              </div>
              <span className="status-nominal">READY</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cycle Ergometer with Vibration Isolation. Aerobic cardiorespiratory training at 150-250 Watts workload.
            </p>
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-space-500/30 flex justify-between text-xs">
              <span className="text-gray-400">Cadence Sensor:</span>
              <span className="mono-data font-semibold text-emerald-500">Calibrated</span>
            </div>
          </div>
        </div>
      </div>

      {/* 20-Week Muscle Atrophy Modeling & Exercise History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Muscle Volume Trajectory */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="heading-display text-sm text-gray-900 dark:text-white">
              20-WEEK MUSCLE RETENTION TRAJECTORY (%)
            </h3>
            <span className="text-xs text-gray-400">Upper vs Lower Body</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Lower body soleus/quadriceps experience higher microgravity unloading atrophy
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={muscleTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} stroke={darkMode ? '#64748b' : '#94a3b8'} interval={2} />
                <YAxis domain={[85, 102]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="upper" stroke="#10B981" strokeWidth={2} dot={false} name="Upper Body" />
                <Line type="monotone" dataKey="core" stroke="#3B82F6" strokeWidth={2} dot={false} name="Core / Back" />
                <Line type="monotone" dataKey="lower" stroke="#EF4444" strokeWidth={2} dot={false} name="Lower Limbs (Legs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-emerald-500" /> Upper Body</div>
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-blue-500" /> Core / Paraspinal</div>
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-red-500" /> Lower Limbs</div>
          </div>
        </div>

        {/* 7-Day Session Duration & Caloric Expenditure */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="heading-display text-sm text-gray-900 dark:text-white">
              7-DAY EXERCISE SESSION DURATION (MINUTES)
            </h3>
            <span className="text-xs text-emerald-500 font-semibold">Goal: 150 min/day</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Combined daily minutes across resistance (ARED) and cardio (T2/CEVIS)
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseLog}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} />
                <YAxis domain={[0, 180]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit=" m" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="totalDuration" fill="#10B981" radius={[4, 4, 0, 0]} name="Exercise Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
