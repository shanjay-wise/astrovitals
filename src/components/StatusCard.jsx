import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatusCard({ icon: Icon, title, value, unit, status, trend, subtitle, onClick, children }) {
  const statusStyles = {
    nominal: 'border-l-status-nominal',
    warning: 'border-l-status-warning',
    critical: 'border-l-status-critical',
    info: 'border-l-status-info',
  }

  const statusDotStyles = {
    nominal: 'bg-status-nominal',
    warning: 'bg-status-warning',
    critical: 'bg-status-critical animate-pulse',
    info: 'bg-status-info',
  }

  const statusLabels = {
    nominal: 'NOMINAL',
    warning: 'WARNING',
    critical: 'CRITICAL',
    info: 'INFO',
  }

  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div
      className={`card border-l-4 ${statusStyles[status] || statusStyles.nominal} cursor-pointer group`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-space-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${statusDotStyles[status] || statusDotStyles.nominal}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${
            status === 'nominal' ? 'text-status-nominal' :
            status === 'warning' ? 'text-status-warning' :
            status === 'critical' ? 'text-status-critical' : 'text-status-info'
          }`}>
            {statusLabels[status] || 'NOMINAL'}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="mono-data text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          {unit && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend === 'up' ? 'text-status-nominal' : trend === 'down' ? 'text-status-critical' : 'text-gray-400'
          }`}>
            {React.createElement(trendIcon, { className: 'w-3.5 h-3.5' })}
            <span>{trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}</span>
          </div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
