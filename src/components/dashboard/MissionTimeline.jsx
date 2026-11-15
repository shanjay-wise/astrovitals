import React from 'react'
import { Rocket, Flag, CheckCircle, Clock } from 'lucide-react'

export default function MissionTimeline({ missionDay = 147 }) {
  const milestones = [
    { day: 1, title: 'Earth Departure Burn (TLI)', status: 'completed' },
    { day: 28, title: 'Lunar Flyby & Gravitational Assist', status: 'completed' },
    { day: 90, title: 'Deep Space Mid-Course Correction (MCC-2)', status: 'completed' },
    { day: 147, title: 'Interplanetary Cruise (Current Position)', status: 'current' },
    { day: 210, title: 'Automated Cargo Resupply Rendezvous', status: 'upcoming' },
    { day: 280, title: 'Mars Orbit Insertion & Atmospheric Braking', status: 'upcoming' },
  ]

  return (
    <div className="mission-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-nasa-blue dark:text-nasa-blueLight" />
          <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            MISSION FLIGHT TIMELINE (ARTEMIS VII)
          </h3>
        </div>
        <span className="mono-data text-xs font-bold text-nasa-blue dark:text-nasa-blueLight">
          MET Day {missionDay} / 280
        </span>
      </div>

      <div className="relative border-l-2 border-gray-200 dark:border-space-700 ml-3 my-2 space-y-4">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative pl-6">
            {/* Timeline Dot */}
            <span className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              m.status === 'completed'
                ? 'bg-emerald-500 border-white dark:border-space-900 text-white'
                : m.status === 'current'
                ? 'bg-nasa-blue dark:bg-nasa-blueLight border-white dark:border-space-900 ring-4 ring-blue-500/20 animate-pulse'
                : 'bg-gray-200 dark:bg-space-800 border-gray-400 dark:border-space-600'
            }`}>
              {m.status === 'completed' && <CheckCircle className="w-2.5 h-2.5" />}
            </span>

            <div className="flex items-baseline justify-between text-xs">
              <span className={`font-semibold ${
                m.status === 'current' ? 'text-nasa-blue dark:text-nasa-blueLight font-bold' :
                m.status === 'completed' ? 'text-gray-900 dark:text-gray-200' : 'text-gray-400'
              }`}>
                {m.title}
              </span>
              <span className="mono-data text-[10px] text-gray-400">
                Day {m.day}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
