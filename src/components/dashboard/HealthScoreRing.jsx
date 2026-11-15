import React from 'react'
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { computeHealthStatus } from '../../services/healthScoring'

export default function HealthScoreRing({ score, astronaut, vitals, statuses, alerts = [], healthInfo = null }) {
  // Use shared health computation
  const health = healthInfo || computeHealthStatus(astronaut, vitals, alerts)

  const currentScore = health.score
  const currentStatus = health.status
  const currentLabel = health.statusLabel
  const deductionsList = health.deductions

  const size = 150
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, currentScore)) / 100
  const strokeDashoffset = circumference * (1 - progress)

  // Color calculation matching single agreed status
  const strokeColor = currentStatus === 'nominal' ? '#22C55E' : currentStatus === 'caution' ? '#F59E0B' : '#EF4444'

  return (
    <div className="mission-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
          CREW HEALTH INDEX
        </h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          currentStatus === 'nominal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' :
          currentStatus === 'caution' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' :
          'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400 animate-pulse'
        }`}>
          {currentLabel}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
        {/* SVG Circular Ring */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-gray-100 dark:text-space-800"
              fill="none"
            />
            {/* Animated Score Progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="none"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
              {currentScore}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              / 100 PTS
            </span>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="flex-1 w-full space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Active Score Variance Factors:
          </p>

          {deductionsList.length === 0 ? (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>All vital channels within nominal NASA-STD-3001 baselines. Zero penalty deductions.</span>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[110px] overflow-y-auto scrollbar-thin">
              {deductionsList.map((factor, idx) => {
                const isCrit = factor.toLowerCase().includes('critical') ||
                               factor.toLowerCase().includes('spike') ||
                               factor.toLowerCase().includes('severe') ||
                               currentStatus === 'critical'
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded border text-[11px] flex items-center justify-between ${
                      isCrit
                        ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300'
                        : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isCrit ? 'text-red-500' : 'text-amber-500'}`} />
                      {factor}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-space-800 text-[10px] text-gray-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-nasa-blue dark:text-nasa-blueLight" />
          <span>NASA-STD-3001 Vol 1 §4.2 Risk Model</span>
        </span>
        <span className="mono-data">
          {deductionsList.length === 0 ? 'STATUS: ZERO DEVIATION' : `${deductionsList.length} ACTIVE VARIANCE(S)`}
        </span>
      </div>
    </div>
  )
}
