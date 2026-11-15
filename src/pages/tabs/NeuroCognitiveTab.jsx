import React, { useState } from 'react'
import { Brain, Zap, Clock, ShieldCheck, Info, ExternalLink, Trophy } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'

export default function NeuroCognitiveTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('24h')

  // Interactive Reaction Time Mini-Game State (NASA PVT-B)
  const [gameState, setGameState] = useState('idle') // 'idle' | 'waiting' | 'ready' | 'finished'
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(null)
  const [recentScores, setRecentScores] = useState([245, 238, 252])

  const startTest = () => {
    setGameState('waiting')
    setReactionTime(null)
    const delay = 1200 + Math.random() * 2500
    setTimeout(() => {
      setStartTime(Date.now())
      setGameState('ready')
    }, delay)
  }

  const handleClickTarget = () => {
    if (gameState === 'ready') {
      const elapsed = Date.now() - startTime
      setReactionTime(elapsed)
      setGameState('finished')
      setRecentScores([elapsed, ...recentScores.slice(0, 4)])
    } else if (gameState === 'waiting') {
      setGameState('idle')
      alert('False Start! You must wait until the target turns green.')
    }
  }

  // 24h cognitive alertness trend
  const cognitiveTrend = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    score: Math.round((currentVitals?.cognitiveScore || 90) + Math.sin(i / 24 * Math.PI) * 8 + (Math.random() - 0.5) * 4)
  }))

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              NEURO-VESTIBULAR & COGNITIVE VIGILANCE
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Space Motion Sickness (SMS), Vestibulo-Ocular Reflex & NASA PVT-B Alertness
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
          <span className="text-[10px] text-gray-400 font-bold uppercase">Cognitive Score</span>
          <p className="mono-data text-2xl font-extrabold text-indigo-500 mt-1">
            {currentVitals?.cognitiveScore || 92}%
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">NASA HRP Psychomotor Battery</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Average Reaction Time</span>
          <p className="mono-data text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {reactionTime || recentScores[0]} <span className="text-xs font-normal text-gray-400">ms</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">NASA Threshold: &lt;280 ms</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Space Motion Sickness</span>
          <p className="mono-data text-2xl font-extrabold text-emerald-500 mt-1">
            GRADE 0 <span className="text-xs font-normal text-gray-400">(Adapted)</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Otolith-canal conflict resolved</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Attention Lapses</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            0 <span className="text-xs font-normal text-gray-400">lapses</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">No responses &gt;355 ms</p>
        </div>
      </div>

      {/* Interactive NASA PVT-B Reaction Mini-Game */}
      <div className="mission-card border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
              NASA PSYCHOMOTOR VIGILANCE TEST (PVT-B MINI-GAME)
            </h3>
          </div>
          <span className="text-xs text-gray-400">Flight-Surgeon Certified</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Evaluates astronaut vigilance and micro-sleep events. Tap 'Start Test', wait for the signal box to turn GREEN, then click as fast as possible.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Reaction Target Box */}
          <div
            onClick={handleClickTarget}
            className={`w-full sm:w-64 h-36 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none transition-all shadow-inner border-2 ${
              gameState === 'ready'
                ? 'bg-emerald-500 border-emerald-400 text-white scale-105 animate-pulse'
                : gameState === 'waiting'
                ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400'
                : gameState === 'finished'
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-space-800 border-dashed border-gray-300 dark:border-space-600 text-gray-500'
            }`}
          >
            {gameState === 'idle' && (
              <div className="text-center p-2">
                <Clock className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                <span className="font-bold text-xs">CLICK TO START</span>
                <p className="text-[10px] text-gray-400 mt-0.5">Ready for 3-minute sample</p>
              </div>
            )}
            {gameState === 'waiting' && (
              <div className="text-center">
                <span className="font-bold text-sm">WAIT FOR GREEN...</span>
                <p className="text-[10px] opacity-80">Do not click early</p>
              </div>
            )}
            {gameState === 'ready' && (
              <div className="text-center font-extrabold text-2xl tracking-wider">
                CLICK NOW!
              </div>
            )}
            {gameState === 'finished' && (
              <div className="text-center">
                <span className="mono-data text-3xl font-extrabold">{reactionTime} ms</span>
                <p className="text-[10px] font-bold mt-1 uppercase">
                  {reactionTime < 240 ? '✓ Exceptional Alertness' : reactionTime < 290 ? '✓ Nominal NASA Baseline' : '⚠️ Mild Fatigue Lapse'}
                </p>
              </div>
            )}
          </div>

          {/* Test Controls & Scores History */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={startTest}
                disabled={gameState === 'waiting'}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all disabled:opacity-50"
              >
                {gameState === 'finished' ? 'Test Again' : 'Initiate PVT Test'}
              </button>
              {gameState !== 'idle' && (
                <button
                  onClick={() => setGameState('idle')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-space-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-800/60 border border-gray-100 dark:border-space-700">
              <span className="text-[10px] uppercase font-bold text-gray-400">Recent Reaction Trials:</span>
              <div className="flex gap-2 mt-1.5">
                {recentScores.map((score, i) => (
                  <span
                    key={i}
                    className={`mono-data text-xs font-bold px-2 py-0.5 rounded border ${
                      score < 260
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    {score} ms
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cognitive Score Trend with NASA Reference Band */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            24-HOUR COGNITIVE LOAD & ALERTNESS PROFILE
          </h3>
          <span className="status-nominal">REFERENCE BAND: 80% - 100%</span>
        </div>
        <ReferenceBandChart
          data={cognitiveTrend}
          dataKey="score"
          timeKey="time"
          color="#6366F1"
          unit="%"
          referenceMin={80}
          referenceMax={100}
          referenceLabel="NASA High Vigilance Band (>80%)"
          domain={[60, 100]}
          height={250}
        />
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>Status Explanation: Neuro-Vestibular Adaptation</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Upon entering zero gravity, the brain receives discordant sensory inputs: otolith organs no longer signal gravity downward while semicircular canals still register head rotations. This mismatch produces Space Motion Sickness (SMS) in 70% of astronauts for the first 48–72 hours before central neuroplastic adaptation occurs.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            The NASA PVT-B reaction test is a mandatory operational gate prior to conducting complex EVAs, robotics arm maneuvers, or spacecraft docking. If mean reaction latency exceeds 280 ms or more than 2 lapses occur (&gt;355 ms), the astronaut must execute a mandatory 90-minute sleep buffer before mission-critical tasks.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA-STD-3001 Vol 1 §4.4 (Cognitive & Behavioral Performance Standards)</span>
        <a
          href="https://www.nasa.gov/hrp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Behavioral Health Research <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
