import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Brain, Moon, Smile, Zap, Users, Coffee, TrendingUp,
  AlertCircle, Sparkles, Sun, Eye, Clock, CheckCircle2
} from 'lucide-react'
import { useCrew } from '../context/CrewContext'
import { useTheme } from '../context/ThemeContext'
import { emotionConfig, generateStressTrend, generateMoodHistory } from '../data/emotionData'
import GaugeChart from '../components/GaugeChart'

export default function EmotionMonitor() {
  const { currentMember } = useCrew()
  const { darkMode } = useTheme()
  const emotions = emotionConfig[currentMember.id] || emotionConfig['cmd-01']
  const stressTrend = generateStressTrend(emotions.stressIndex.current)
  const moodHistory = generateMoodHistory()

  // State for interactive Psychomotor Vigilance Task (PVT-B) check
  const [pvtRunning, setPvtRunning] = useState(false)
  const [pvtResult, setPvtResult] = useState(null)
  const [pvtReactionTime, setPvtReactionTime] = useState(null)
  const [pvtStartTime, setPvtStartTime] = useState(null)

  const startPVT = () => {
    setPvtRunning(true)
    setPvtResult('Wait for signal...')
    setPvtReactionTime(null)
    const delay = 1500 + Math.random() * 2500
    setTimeout(() => {
      setPvtStartTime(Date.now())
      setPvtResult('CLICK NOW!')
    }, delay)
  }

  const handlePVTClick = () => {
    if (pvtResult === 'CLICK NOW!' && pvtStartTime) {
      const elapsed = Date.now() - pvtStartTime
      setPvtReactionTime(elapsed)
      setPvtRunning(false)
      setPvtResult(`Response: ${elapsed} ms (${elapsed < 240 ? 'Optimal' : elapsed < 320 ? 'Nominal' : 'Lapse / Fatigued'})`)
    } else if (pvtRunning && pvtResult === 'Wait for signal...') {
      setPvtRunning(false)
      setPvtResult('False Start! Wait for prompt.')
    }
  }

  // Sleep architecture breakdown based on current member's sleep hours
  const sleepData = [
    { day: 'Day 141', rem: 1.6, deep: 1.8, light: 3.4, total: 6.8 },
    { day: 'Day 142', rem: 1.5, deep: 1.9, light: 3.8, total: 7.2 },
    { day: 'Day 143', rem: 1.8, deep: 2.1, light: 3.5, total: 7.4 },
    { day: 'Day 144', rem: 1.2, deep: 1.4, light: 3.2, total: 5.8 },
    { day: 'Day 145', rem: 1.7, deep: 1.9, light: 3.6, total: 7.2 },
    { day: 'Day 146', rem: 1.1, deep: 1.2, light: 2.8, total: 5.1 },
    { day: 'Day 147', rem: (emotions.sleepQuality.hours * 0.22).toFixed(1), deep: (emotions.sleepQuality.hours * 0.26).toFixed(1), light: (emotions.sleepQuality.hours * 0.52).toFixed(1), total: emotions.sleepQuality.hours },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">BEHAVIORAL HEALTH & PERFORMANCE</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
              NASA HRP BHP ELEMENT
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Psychological resilience, circadian rhythm, and cognitive workload analysis for {currentMember.name}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs">
          <Brain className="w-4 h-4 text-purple-500" />
          <span>Cognitive State: <strong className="font-semibold">{emotions.cognitiveScore.label}</strong></span>
        </div>
      </div>

      {/* Primary Mental Health Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card p-4 flex flex-col items-center text-center">
          <GaugeChart value={emotions.stressIndex.current} max={100} size={84} strokeWidth={8} color="#EF4444" label="Stress Index" unit="%" />
          <span className="text-[10px] text-gray-400 mt-1">{emotions.stressIndex.label}</span>
        </div>

        <div className="card p-4 flex flex-col items-center text-center">
          <GaugeChart value={emotions.moodScore.current} max={100} size={84} strokeWidth={8} color="#10B981" label="Mood Valence" unit="%" />
          <span className="text-[10px] text-gray-400 mt-1">{emotions.moodScore.label}</span>
        </div>

        <div className="card p-4 flex flex-col items-center text-center">
          <GaugeChart value={emotions.sleepQuality.current} max={100} size={84} strokeWidth={8} color="#3B82F6" label="Sleep Quality" unit="%" />
          <span className="text-[10px] text-gray-400 mt-1">{emotions.sleepQuality.hours} hrs rest</span>
        </div>

        <div className="card p-4 flex flex-col items-center text-center">
          <GaugeChart value={emotions.cognitiveScore.current} max={100} size={84} strokeWidth={8} color="#8B5CF6" label="Cognitive Score" unit="%" />
          <span className="text-[10px] text-gray-400 mt-1">{emotions.cognitiveScore.label}</span>
        </div>

        <div className="card p-4 flex flex-col items-center text-center">
          <GaugeChart value={emotions.fatigueLevel.current} max={100} size={84} strokeWidth={8} color="#F59E0B" label="Fatigue Score" unit="%" />
          <span className="text-[10px] text-gray-400 mt-1">{emotions.fatigueLevel.label}</span>
        </div>

        <div className="card p-4 flex flex-col items-center text-center">
          <GaugeChart value={emotions.socialInteraction.current} max={100} size={84} strokeWidth={8} color="#06B6D4" label="Crew Socializing" unit="%" />
          <span className="text-[10px] text-gray-400 mt-1">{emotions.socialInteraction.label}</span>
        </div>
      </div>

      {/* NASA Psychomotor Vigilance Task (PVT-B) & Circadian Light Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Interactive NASA PVT-B Cognitive Test */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="heading-display text-sm text-gray-900 dark:text-white">
                NASA PVT-B (VIGILANCE REACTION TEST)
              </h3>
            </div>
            <span className="status-nominal">FLIGHT VALIDATED</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            The NASA Psychomotor Vigilance Test measures behavioral alertness and sustained attention. Microgravity sleep fragmentation causes subtle micro-sleeps and response lapses (&gt;355 ms).
          </p>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-200 dark:border-space-500/50 flex flex-col items-center justify-center min-h-[140px] text-center">
            {pvtResult ? (
              <div className="space-y-2">
                <p className={`mono-data text-lg font-bold ${
                  pvtResult === 'CLICK NOW!' ? 'text-red-500 text-2xl animate-bounce' : 'text-gray-900 dark:text-white'
                }`}>
                  {pvtResult}
                </p>
                {pvtResult === 'CLICK NOW!' && (
                  <button
                    onClick={handlePVTClick}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg transition-transform active:scale-95"
                  >
                    TAP HERE FAST!
                  </button>
                )}
                {pvtReactionTime && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    Reaction recorded. NASA HRP Baseline threshold: &lt;280 ms.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ready to test astronaut alertness? Tap start, wait for signal, then tap as fast as possible.
                </p>
                <button
                  onClick={startPVT}
                  disabled={pvtRunning}
                  className="px-5 py-2 rounded-xl bg-nasa-blue text-white hover:bg-blue-700 text-xs font-semibold shadow transition-all"
                >
                  Start 3-Minute PVT-B Sample
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Circadian Lighting & Melatonin Rhythm */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              <h3 className="heading-display text-sm text-gray-900 dark:text-white">
                CIRCADIAN LIGHTING SYSTEM (SSLA)
              </h3>
            </div>
            <span className="status-nominal">SPECTRAL SHIFT: ACTIVE</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Astronauts witness 16 sunrises and sunsets every 24 hours. The Solid-State Light Assemblies (SSLA) regulate melatonin suppression via calibrated wavelengths.
          </p>

          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">Phase 1: Alerting Blue Spectrum (480 nm)</span>
              </div>
              <span className="mono-data text-blue-600 dark:text-blue-400 font-bold">06:00 - 12:00 UTC</span>
            </div>

            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-space-600/40 border border-gray-200 dark:border-space-500/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">Phase 2: General Illuminance (4000 K)</span>
              </div>
              <span className="mono-data text-gray-600 dark:text-gray-300 font-bold">12:00 - 20:30 UTC</span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">Phase 3: Pre-Sleep Amber Spectrum (&lt;2700 K)</span>
              </div>
              <span className="mono-data text-amber-600 dark:text-amber-400 font-bold">20:30 - 22:00 UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Actigraphy & Stress History Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sleep Stages / Actigraphy */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="heading-display text-sm text-gray-900 dark:text-white">
              7-DAY SLEEP ARCHITECTURE (ACTIGRAPHY)
            </h3>
            <span className="text-xs text-gray-400">Target: 8.0 hrs/night</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Continuous sleep staging tracked by sleep-pod sensor array
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit=" h" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="deep" stackId="a" fill="#3B82F6" name="Deep (SWS)" />
                <Bar dataKey="rem" stackId="a" fill="#8B5CF6" name="REM" />
                <Bar dataKey="light" stackId="a" fill="#06B6D4" name="Light Sleep" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500" /> Deep Sleep</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500" /> REM Sleep</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-cyan-500" /> Light Sleep</div>
          </div>
        </div>

        {/* 28-Day Stress & Mood Progression */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="heading-display text-sm text-gray-900 dark:text-white">
              4-WEEK STRESS & MOOD DYNAMICS
            </h3>
            <span className="text-xs text-gray-400">Mission Days 120-147</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Stress index vs subjective mood valence index
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stressTrend}>
                <defs>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke={darkMode ? '#64748b' : '#94a3b8'} interval={3} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} fill="url(#stressGrad)" name="Stress" />
                <Area type="monotone" dataKey="mood" stroke="#10B981" strokeWidth={2} fill="url(#moodGrad)" name="Mood Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-red-500" /> Stress Index</div>
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-emerald-500" /> Mood Valence</div>
          </div>
        </div>
      </div>

      {/* NASA BHP Autonomous Psychological Countermeasures */}
      <div className="card">
        <h3 className="heading-display text-sm text-gray-900 dark:text-white mb-3">
          PRESCRIPTIVE PSYCHOLOGICAL COUNTERMEASURES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-100 dark:border-space-500/30">
            <div className="flex items-center gap-2 text-nasa-blue dark:text-blue-400 mb-1 font-semibold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Virtual Reality Natural Biome</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">
              Prescribed 20-minute immersive audio-visual immersion in terrestrial Redwood Forest scenery to relieve sensory monotony.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-100 dark:border-space-500/30">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1 font-semibold text-xs">
              <Users className="w-4 h-4" />
              <span>Autonomous Group Dynamic Sync</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">
              Facilitated cross-crew communal meal scheduled at 19:30 UTC. Interpersonal cohesion index currently nominal.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-100 dark:border-space-500/30">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1 font-semibold text-xs">
              <Clock className="w-4 h-4" />
              <span>Workload Throttling Protocol</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">
              {emotions.stressIndex.current > 50
                ? 'High cognitive workload detected. EVA prep pushed back by 90 minutes to ensure adequate sleep hygiene.'
                : 'Current flight timeline workload is balanced within nominal NASA HRP limits.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
