import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function MiniSparkline({ data, dataKey = 'value', color = '#10B981', height = 40 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
