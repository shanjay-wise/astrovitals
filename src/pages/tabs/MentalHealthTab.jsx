import React, { useState } from 'react'
import { Smile, Frown, Meh, Heart, BookOpen, Send, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import ReferenceBandChart from '../../components/common/ReferenceBandChart'
import { generateStressTrend } from '../../data/emotionData'

export default function MentalHealthTab() {
  const { astronauts, selectedAstronautId, currentVitals } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [trendRange, setTrendRange] = useState('7d')

  // Interactive Mood Check-in & Journal State
  const [selectedMood, setSelectedMood] = useState('positive')
  const [journalEntry, setJournalEntry] = useState('')
  const [journalLog, setJournalLog] = useState([
    {
      date: 'Day 146 20:30 UTC',
      mood: '😊 Calm & Focused',
      note: 'Completed 2.5h ARED deadlifts and CEVIS cycle. Earth visual comm window was crisp with 4-min delay.'
    },
    {
      date: 'Day 145 19:15 UTC',
      mood: '😐 Sensory Monotony',
      note: 'Cabin acoustic hum is noticeable today. Spent 20 min in the VR Redwood biome session which helped rest my eyes.'
    }
  ])

  const handleSaveJournal = (e) => {
    e.preventDefault()
    if (!journalEntry.trim()) return

    const moodEmoji = selectedMood === 'positive' ? '😊 Positive & Energized' : selectedMood === 'neutral' ? '😐 Neutral' : '😟 Elevated Stress'
    setJournalLog([
      {
        date: `Day ${currentAstro.missionDay} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC`,
        mood: moodEmoji,
        note: journalEntry
      },
      ...journalLog
    ])
    setJournalEntry('')
  }

  const stressIndex = currentVitals?.stressIndex || 28
  const stressTrend = generateStressTrend(stressIndex)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Smile className="w-6 h-6 text-pink-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              BEHAVIORAL HEALTH & STRESS RESILIENCE
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • NASA BHP Psychological Support, Isolation Stress & Mood Check-in
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
          <span className="text-[10px] text-gray-400 font-bold uppercase">Psychological Stress</span>
          <p className={`mono-data text-2xl font-extrabold mt-1 ${stressIndex > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {stressIndex}% <span className="text-xs font-normal text-gray-400">{stressIndex > 60 ? 'Elevated' : 'Nominal'}</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Autonomic cortisol proxy</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Interpersonal Cohesion</span>
          <p className="mono-data text-2xl font-extrabold text-blue-500 mt-1">
            92% <span className="text-xs font-normal text-gray-400">High</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Crew sync & comms index</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Confinement Index</span>
          <p className="mono-data text-2xl font-extrabold text-purple-500 mt-1">
            LOW <span className="text-xs font-normal text-gray-400">Sensory Load</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">VR Redwood biomes active</p>
        </div>

        <div className="mission-card">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Earth Comms Latency</span>
          <p className="mono-data text-2xl font-extrabold text-pink-500 mt-1">
            4.2 <span className="text-xs font-normal text-gray-400">min one-way</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Deep Space Network Mars link</p>
        </div>
      </div>

      {/* Stress Index Chart with Shaded NASA Reference Band */}
      <div className="mission-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            28-DAY AUTONOMIC STRESS DYNAMICS (WITH NASA TOLERANCE BAND: 0% - 50%)
          </h3>
          <span className="status-nominal">NASA BHP TARGET &lt;50%</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Composite index calculated from Heart Rate Variability (RMSSD), voice acoustic biomarker micro-tremors, and sleep latency.
        </p>
        <ReferenceBandChart
          data={stressTrend}
          dataKey="stress"
          timeKey="day"
          color="#EC4899"
          unit="%"
          referenceMin={0}
          referenceMax={50}
          referenceLabel="NASA Nominal Stress Band (<50%)"
          domain={[0, 100]}
          height={260}
        />
      </div>

      {/* Interactive Mood Check-In & Astronaut Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Mood Check-In Form */}
        <div className="mission-card">
          <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-3">
            DAILY ASTRONAUT SUBJECTIVE CHECK-IN & JOURNAL
          </h3>
          <form onSubmit={handleSaveJournal} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Select Current Valence & Mood:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'positive', label: 'Positive', icon: Smile, color: 'text-emerald-500 border-emerald-500' },
                  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-blue-500 border-blue-500' },
                  { id: 'stressed', label: 'Stressed', icon: Frown, color: 'text-amber-500 border-amber-500' },
                ].map(m => {
                  const Icon = m.icon
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        selectedMood === m.id
                          ? `${m.color} bg-gray-100 dark:bg-space-800 font-bold shadow-sm ring-2 ring-current`
                          : 'border-gray-200 dark:border-space-700 text-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1">Personal Voice / Reflection Log:</label>
              <textarea
                rows={3}
                required
                placeholder="Log your thoughts on crew cohesion, sensory monotony, or physical recovery..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl text-xs font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Daily Psychological Log</span>
            </button>
          </form>
        </div>

        {/* Previous Journal Entries */}
        <div className="mission-card">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-pink-500" />
            <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              RECENT PSYCHOLOGICAL JOURNAL LOGS
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto scrollbar-thin">
            {journalLog.map((entry, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-100 dark:border-space-700 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">{entry.mood}</span>
                  <span className="mono-data text-[10px] text-gray-400">{entry.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  "{entry.note}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-pink-500" />
            <span>Status Explanation: Isolation & Earth-Out-Of-View Phenomenon</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            During transit to Mars, Earth shrinks to a pale speck. Combined with communication delays up to 22 minutes one-way, astronauts experience unique psychological isolation. Studies from Antarctic stations and Mars-500 highlight risks of depressive drift, interpersonal micro-conflicts, and asthenia.
          </p>
        </div>

        <div className="mission-card">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>What This Means for the Astronaut</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Countermeasures include scheduled weekly private family tele-conferences, sensory stimulation using VR natural biome headsets, autonomy in work scheduling, and structured communal meals to maintain cross-crew cohesion.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA Behavioral Health & Performance (BHP) Standard Guidelines (NASA-STD-3001 Vol 1 §4.4)</span>
        <a
          href="https://www.nasa.gov/hrp/elements/bhp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Behavioral Health Element <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
