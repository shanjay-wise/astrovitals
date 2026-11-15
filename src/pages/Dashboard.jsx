import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  HeartPulse, Brain, Package, RadioTower, Activity, AlertTriangle,
  Shield, Thermometer, Wind, Droplets, Battery, Users, TrendingUp,
  TrendingDown, Clock, Zap, ArrowRight, BookOpen, CheckCircle2
} from 'lucide-react'
import { useCrew } from '../context/CrewContext'
import { useTheme } from '../context/ThemeContext'
import { vitalsConfig, generateECGData, generateHRTrend } from '../data/vitalsData'
import { emotionConfig } from '../data/emotionData'
import { supplyConfig, generateSupplyForecast } from '../data/supplyData'
import { radiationConfig } from '../data/radiationData'
import { activityConfig } from '../data/activityData'
import { getAlertCounts, getActiveAlerts } from '../data/alertsData'
import { nasaStandards } from '../data/nasaStandardsData'
import GaugeChart from '../components/GaugeChart'

export default function Dashboard() {
  const navigate = useNavigate()
  const { currentMember, crewMembers } = useCrew()
  const { darkMode } = useTheme()
  const [ecgData, setEcgData] = useState(() => generateECGData(200))
  const alertCounts = getAlertCounts()
  const activeAlerts = getActiveAlerts()

  const vitals = vitalsConfig[currentMember.id] || vitalsConfig['cmd-01']
  const emotions = emotionConfig[currentMember.id] || emotionConfig['cmd-01']
  const radiation = radiationConfig[currentMember.id] || radiationConfig['cmd-01']
  const activity = activityConfig[currentMember.id] || activityConfig['cmd-01']

  // Simulate real-time ECG updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgData(generateECGData(200))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const supplyForecast = generateSupplyForecast()
  const hrTrend = generateHRTrend(vitals.heartRate.current)

  return (
    <div className="space-y-6">
      {/* Page Title & NASA Standards Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">MISSION CONTROL DASHBOARD</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
              NASA-STD-3001
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Integrated astronaut health telemetry • Telemetry subject: <strong className="text-gray-900 dark:text-white">{currentMember.name}</strong> ({currentMember.role})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-space-700 border border-gray-200 dark:border-space-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="mono-data text-xs text-gray-700 dark:text-gray-300">
              MET Day {currentMember.missionDay} • {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
            </span>
          </div>
        </div>
      </div>

      {/* Active Alerts Banner */}
      {alertCounts.active > 0 && (
        <div
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors shadow-sm"
          onClick={() => navigate('/alerts')}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {alertCounts.active} Active Bio-Telemetry Alert{alertCounts.active !== 1 ? 's' : ''} Requiring Flight Surgeon Attention
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              {activeAlerts[0]?.title} {activeAlerts.length > 1 ? `and ${activeAlerts.length - 1} more event(s)` : ''}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
        </div>
      )}

      {/* Crew Overview Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Expedition Crew Status (Select to Switch Telemetry)</span>
          <span className="text-xs text-gray-400">Blood Types: O+, A+, B+, AB+</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {crewMembers.map(member => (
            <div
              key={member.id}
              onClick={() => {
                // switch crew via context if needed or handled through Header
              }}
              className={`card p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                member.id === currentMember.id ? 'ring-2 ring-nasa-blue dark:ring-blue-500 shadow-md' : 'hover:border-gray-300 dark:hover:border-space-500'
              }`}
            >
              <span className="text-2xl">{member.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{member.name.split(' ').slice(-1)[0]}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
              </div>
              <span className={`status-${member.status === 'nominal' ? 'nominal' : member.status === 'warning' ? 'warning' : 'critical'}`}>
                {member.status === 'nominal' ? '✓ NOM' : member.status === 'warning' ? '⚠ WARN' : '✕ CRIT'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Monitoring Grid - All 6 Systems Combined */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Cardiac & Vitals Monitor */}
        <div
          className="card border-l-4 cursor-pointer hover:scale-[1.01] transition-transform"
          style={{ borderLeftColor: vitals.heartRate.status === 'nominal' ? '#10B981' : vitals.heartRate.status === 'warning' ? '#F59E0B' : '#EF4444' }}
          onClick={() => navigate('/vitals')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Cardiac & Hemodynamics</h3>
                <p className="text-[10px] text-gray-400">Lead-II Electrocardiogram</p>
              </div>
            </div>
            <span className={`status-${vitals.heartRate.status}`}>{vitals.heartRate.status.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Heart Rate</p>
              <p className="mono-data text-xl font-bold text-gray-900 dark:text-white">{vitals.heartRate.current}</p>
              <p className="text-[10px] text-gray-400">{vitals.heartRate.unit}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Blood Press.</p>
              <p className="mono-data text-xl font-bold text-gray-900 dark:text-white">{vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}</p>
              <p className="text-[10px] text-gray-400">{vitals.bloodPressure.unit}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">SpO₂</p>
              <p className="mono-data text-xl font-bold text-gray-900 dark:text-white">{vitals.spO2.current}</p>
              <p className="text-[10px] text-gray-400">{vitals.spO2.unit}</p>
            </div>
          </div>

          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hrTrend.slice(-12)}>
                <Line type="monotone" dataKey="hr" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-right text-gray-400 mt-1">Tap for live waveform & SANS risk →</p>
        </div>

        {/* Card 2: Mental Health & Emotions */}
        <div
          className="card border-l-4 cursor-pointer hover:scale-[1.01] transition-transform"
          style={{ borderLeftColor: emotions.stressIndex.status === 'nominal' ? '#10B981' : emotions.stressIndex.status === 'warning' ? '#F59E0B' : '#EF4444' }}
          onClick={() => navigate('/emotions')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Mental Health & Mood</h3>
                <p className="text-[10px] text-gray-400">NASA BHP Element</p>
              </div>
            </div>
            <span className={`status-${emotions.stressIndex.status}`}>{emotions.stressIndex.status.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="text-center">
              <GaugeChart value={emotions.stressIndex.current} max={100} size={76} strokeWidth={8} color="#8B5CF6" label="Stress Index" unit="%" />
            </div>
            <div className="space-y-1.5 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Mood Valence</p>
                <p className="font-semibold text-gray-900 dark:text-white">{emotions.moodScore.label} ({emotions.moodScore.current}%)</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Sleep Quality</p>
                <p className="font-semibold text-gray-900 dark:text-white">{emotions.sleepQuality.label} ({emotions.sleepQuality.hours}h)</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Cognitive Vigilance</p>
                <p className="font-semibold text-gray-900 dark:text-white">{emotions.cognitiveScore.label}</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-right text-gray-400 mt-1">Tap for PVT reaction & sleep actigraphy →</p>
        </div>

        {/* Card 3: Supply Status (ECLSS) */}
        <div
          className="card border-l-4 border-l-status-nominal cursor-pointer hover:scale-[1.01] transition-transform"
          onClick={() => navigate('/supplies')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Life Support Consumables</h3>
                <p className="text-[10px] text-gray-400">ECLSS Regenerative Closed-Loop</p>
              </div>
            </div>
            <span className="status-nominal">NOMINAL</span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Oxygen', value: supplyConfig.oxygen.current, icon: Wind, color: '#3B82F6', days: supplyConfig.oxygen.daysRemaining },
              { label: 'Water', value: supplyConfig.water.current, icon: Droplets, color: '#06B6D4', days: supplyConfig.water.daysRemaining },
              { label: 'Food', value: supplyConfig.food.current, icon: Package, color: '#F59E0B', days: supplyConfig.food.daysRemaining },
              { label: 'Power', value: supplyConfig.power.current, icon: Zap, color: '#10B981', days: '12.5 kW' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <item.icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 w-12 font-medium">{item.label}</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-space-600 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
                <span className="mono-data text-xs font-semibold text-gray-800 dark:text-gray-200 w-10 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-right text-gray-400 mt-2">Tap for CDRA CO₂ & water recovery →</p>
        </div>

        {/* Card 4: Radiation Dosimetry */}
        <div
          className="card border-l-4 cursor-pointer hover:scale-[1.01] transition-transform"
          style={{ borderLeftColor: radiation.cumulativeDose.status === 'nominal' ? '#10B981' : '#F59E0B' }}
          onClick={() => navigate('/radiation')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <RadioTower className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Radiation Exposure</h3>
                <p className="text-[10px] text-gray-400">GCR & Solar Flux TEPC</p>
              </div>
            </div>
            <span className={`status-${radiation.cumulativeDose.status}`}>{radiation.cumulativeDose.status.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Cumulative</p>
              <p className="mono-data text-xl font-bold text-gray-900 dark:text-white">{radiation.cumulativeDose.current}</p>
              <p className="text-[10px] text-gray-400">{radiation.cumulativeDose.unit} / 600 limit</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Daily Rate</p>
              <p className="mono-data text-xl font-bold text-gray-900 dark:text-white">{radiation.dailyDose.current}</p>
              <p className="text-[10px] text-gray-400">{radiation.dailyDose.unit}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-space-600/40">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Shield className="w-3.5 h-3.5 text-status-nominal" />
              <span>Shielding: <strong className="text-status-nominal">{radiation.shieldingStatus}</strong></span>
            </div>
            <span className="text-[10px] text-gray-400">Tap for solar weather →</span>
          </div>
        </div>

        {/* Card 5: Physical Activity & Exercise */}
        <div
          className="card border-l-4 cursor-pointer hover:scale-[1.01] transition-transform"
          style={{ borderLeftColor: activity.dailyExercise.status === 'nominal' ? '#10B981' : '#F59E0B' }}
          onClick={() => navigate('/activity')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Physical Countermeasures</h3>
                <p className="text-[10px] text-gray-400">ARED Resistance & T2</p>
              </div>
            </div>
            <span className={`status-${activity.dailyExercise.status}`}>{activity.dailyExercise.status.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Exercise Today</p>
              <p className="mono-data text-xl font-bold text-gray-900 dark:text-white">{activity.dailyExercise.completed}/{activity.dailyExercise.required}</p>
              <p className="text-[10px] text-gray-400">hours completed</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Caloric Burn</p>
              <p className="mono-data text-xl font-bold text-gray-900 dark:text-white">{activity.caloriesBurned.current}</p>
              <p className="text-[10px] text-gray-400">{activity.caloriesBurned.unit}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Weekly Compliance</span>
              <span className="mono-data font-semibold">{activity.weeklyGoalProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-space-600 rounded-full overflow-hidden">
              <div className="h-full bg-status-nominal rounded-full" style={{ width: `${activity.weeklyGoalProgress}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-right text-gray-400 mt-2">Tap for bone & muscle curves →</p>
        </div>

        {/* Card 6: Alert Center & Triage */}
        <div
          className="card border-l-4 border-l-status-info cursor-pointer hover:scale-[1.01] transition-transform"
          onClick={() => navigate('/alerts')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alerts & Incidents</h3>
                <p className="text-[10px] text-gray-400">Medical Ops Console</p>
              </div>
            </div>
            <span className="status-badge bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              {alertCounts.total} TOTAL
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Crit', count: alertCounts.critical, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
              { label: 'Warn', count: alertCounts.warning, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
              { label: 'Info', count: alertCounts.info, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
              { label: 'OK', count: alertCounts.nominal, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
            ].map(item => (
              <div key={item.label} className={`rounded-xl p-2.5 text-center ${item.color}`}>
                <p className="mono-data text-xl font-bold">{item.count}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-between">
            <span>{alertCounts.active} alert(s) needing acknowledgement</span>
            <span className="text-[10px] text-gray-400">Manage feed →</span>
          </p>
        </div>
      </div>

      {/* Real-Time Live ECG Waveform Stream */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="heading-display text-sm text-gray-900 dark:text-white">LIVE BIOMETRIC ECG WAVEFORM STREAM</h3>
            <span className="flex items-center gap-1 text-[10px] text-status-nominal">
              <span className="w-1.5 h-1.5 rounded-full bg-status-nominal animate-ping" />
              CONTINUOUS 500 Hz
            </span>
          </div>
          <span className="mono-data text-sm font-bold text-red-600 dark:text-red-400">{vitals.heartRate.current} BPM</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ecgData}>
              <defs>
                <linearGradient id="dashboardEcgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a2035' : '#f0f0f0'} />
              <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} fill="url(#dashboardEcgGradient)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NASA Human Research Program Highlights Banner */}
      <div
        className="card p-5 bg-gradient-to-r from-nasa-blue/5 via-blue-500/5 to-purple-500/5 dark:from-nasa-blue/20 dark:via-space-700 dark:to-purple-900/20 border-nasa-blue/30 cursor-pointer hover:border-nasa-blue transition-all"
        onClick={() => navigate('/nasa-research')}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-nasa-blue text-white shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="heading-display text-base text-gray-900 dark:text-white">
                  NASA HUMAN RESEARCH PROGRAM & STANDARDS HUB
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  RIDGE FRAMEWORK
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Explore the 5 hazards of spaceflight, NASA Twins Study multi-omic baselines, and our interactive Mars Transit Mission Simulator.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nasa-blue text-white text-xs font-semibold hover:bg-blue-700 transition-colors self-start md:self-auto">
            <span>Open NASA Standards Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-gray-200 dark:border-space-600/40">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          AstroVitals • Team Proxyma Dynamics • NASA Space Apps Challenge 2026
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
          Designed for Deep Space Missions • NASA-STD-3001 & HRP Compliant
        </p>
      </div>
    </div>
  )
}
