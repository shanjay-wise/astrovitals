import React from 'react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea
} from 'recharts'
import { useAstroStore } from '../../store/useAstroStore'

export default function ReferenceBandChart({
  data,
  dataKey = 'value',
  timeKey = 'time',
  color = '#1E6BFF',
  unit = '',
  referenceMin = 60,
  referenceMax = 100,
  referenceLabel = 'NASA Reference Range',
  domain = ['auto', 'auto'],
  height = 220
}) {
  const { darkMode } = useAstroStore()

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Shaded NASA Reference Band */}
          {referenceMin !== undefined && referenceMax !== undefined && (
            <ReferenceArea
              y1={referenceMin}
              y2={referenceMax}
              fill="#22C55E"
              fillOpacity={darkMode ? 0.08 : 0.12}
              stroke="#22C55E"
              strokeDasharray="3 3"
              strokeOpacity={0.4}
              label={{
                value: referenceLabel,
                position: 'insideTopRight',
                fill: darkMode ? '#4ADE80' : '#15803D',
                fontSize: 10,
                opacity: 0.8
              }}
            />
          )}

          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1A2742' : '#E2E8F0'} />
          <XAxis
            dataKey={timeKey}
            tick={{ fontSize: 10 }}
            stroke={darkMode ? '#64748B' : '#94A3B8'}
            minTickGap={20}
          />
          <YAxis
            domain={domain}
            tick={{ fontSize: 10 }}
            stroke={darkMode ? '#64748B' : '#94A3B8'}
            unit={unit ? ` ${unit}` : ''}
            width={38}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#0B1220' : '#FFFFFF',
              borderColor: darkMode ? '#1A2742' : '#E2E8F0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${dataKey})`}
            name={dataKey.toUpperCase()}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
