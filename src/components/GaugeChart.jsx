export default function GaugeChart({ value, max = 100, size = 120, strokeWidth = 10, color = '#10B981', label, unit, showStatus = true }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const dashOffset = circumference * (1 - progress)

  const getStatusColor = () => {
    if (progress >= 0.8) return '#EF4444'
    if (progress >= 0.6) return '#F59E0B'
    return color
  }

  const getStatusColorForSupply = () => {
    if (progress <= 0.2) return '#EF4444'
    if (progress <= 0.4) return '#F59E0B'
    return color
  }

  const displayColor = label?.toLowerCase().includes('stress') || label?.toLowerCase().includes('fatigue') || label?.toLowerCase().includes('radiation')
    ? getStatusColor()
    : getStatusColorForSupply() === color ? color : getStatusColorForSupply()

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-space-600"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={displayColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="gauge-ring"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="mono-data text-xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(1)) : value}
          </span>
          {unit && <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>}
        </div>
      </div>
      {label && <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">{label}</span>}
    </div>
  )
}
