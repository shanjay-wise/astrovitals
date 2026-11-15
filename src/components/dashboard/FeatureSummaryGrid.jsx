import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeartPulse, Wind, Thermometer, Moon, RadioTower,
  Dumbbell, Brain, Smile, Droplets, Eye, Home, FileText,
  ArrowRight
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

export default function FeatureSummaryGrid({ vitals, statuses, vitalsHistory = [] }) {
  const navigate = useNavigate()

  const sparklineData = vitalsHistory.length > 0
    ? vitalsHistory
    : Array.from({ length: 12 }, (_, i) => ({ hr: 68 + Math.sin(i) * 5, spo2: 98, bpSys: 118 }))

  const features = [
    {
      id: 'cardiovascular',
      title: 'Cardiovascular',
      route: '/tabs/cardiovascular',
      icon: HeartPulse,
      color: '#EF4444',
      value: `${vitals?.hr || 72} bpm`,
      sub: `BP: ${vitals?.bpSys || 118}/${vitals?.bpDia || 76} mmHg`,
      status: statuses?.hr || 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'respiratory',
      title: 'Respiratory',
      route: '/tabs/respiratory',
      icon: Wind,
      color: '#06B6D4',
      value: `${vitals?.spo2 || 98.2}%`,
      sub: `Resp: ${vitals?.resp || 15} br/min`,
      status: statuses?.spo2 || 'nominal',
      dataKey: 'spo2'
    },
    {
      id: 'temperature',
      title: 'Core Temperature',
      route: '/tabs/temperature',
      icon: Thermometer,
      color: '#F59E0B',
      value: `${vitals?.coreTemp || 36.7}°C`,
      sub: 'Microgravity convection loss',
      status: statuses?.temp || 'nominal',
      dataKey: 'coreTemp'
    },
    {
      id: 'sleep',
      title: 'Sleep & Circadian',
      route: '/tabs/sleep',
      icon: Moon,
      color: '#8B5CF6',
      value: `${vitals?.sleepScore || 85}%`,
      sub: 'SSLA 480nm spectrum sync',
      status: (vitals?.sleepScore || 85) < 60 ? 'caution' : 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'radiation',
      title: 'Radiation Dosimetry',
      route: '/tabs/radiation',
      icon: RadioTower,
      color: '#EAB308',
      value: `${vitals?.radiationRate || 0.042} mSv/h`,
      sub: 'GCR TEPC sensor active',
      status: statuses?.radiation || 'nominal',
      dataKey: 'radiation'
    },
    {
      id: 'musculoskeletal',
      title: 'Musculoskeletal',
      route: '/tabs/musculoskeletal',
      icon: Dumbbell,
      color: '#10B981',
      value: `${vitals?.boneDensity || 98}% BMD`,
      sub: `Muscle: ${vitals?.muscleMass || 96}%`,
      status: (vitals?.boneDensity || 98) < 92 ? 'caution' : 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'neuro-cognitive',
      title: 'Neuro & Cognitive',
      route: '/tabs/neuro-cognitive',
      icon: Brain,
      color: '#6366F1',
      value: `${vitals?.cognitiveScore || 92}%`,
      sub: 'PVT-B response: 242 ms',
      status: (vitals?.cognitiveScore || 92) < 75 ? 'caution' : 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'mental-health',
      title: 'Mental Health & Stress',
      route: '/tabs/mental-health',
      icon: Smile,
      color: '#EC4899',
      value: `${vitals?.stressIndex || 28}%`,
      sub: 'Mood Valence: Positive',
      status: (vitals?.stressIndex || 28) > 65 ? 'caution' : 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'nutrition',
      title: 'Nutrition & Hydration',
      route: '/tabs/nutrition',
      icon: Droplets,
      color: '#3B82F6',
      value: `${vitals?.hydration || 91}%`,
      sub: 'Energy: 2,800 kcal/day',
      status: (vitals?.hydration || 91) < 80 ? 'caution' : 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'fluid-shift',
      title: 'Fluid Shift & Vision',
      route: '/tabs/fluid-shift',
      icon: Eye,
      color: '#14B8A6',
      value: 'SANS Grade 0',
      sub: 'Cephalic fluid: +1.8 L',
      status: 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'habitat',
      title: 'Habitat Environment',
      route: '/tabs/habitat',
      icon: Home,
      color: '#38BDF8',
      value: `${vitals?.cabinCO2 || 2.1} mmHg`,
      sub: 'NASA-STD-3001 < 3.0 mmHg',
      status: statuses?.co2 || 'nominal',
      dataKey: 'hr'
    },
    {
      id: 'medical-log',
      title: 'Medical Log & PDF',
      route: '/tabs/medical-log',
      icon: FileText,
      color: '#84CC16',
      value: 'Flight Ready',
      sub: 'PDF & CSV Export Available',
      status: 'nominal',
      dataKey: 'hr'
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
          ALL 12 BIOMEDICAL SUBSYSTEMS SUMMARY
        </h3>
        <span className="text-[10px] text-gray-400">Click any card to inspect full telemetry</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {features.map((feat) => {
          const Icon = feat.icon
          return (
            <div
              key={feat.id}
              onClick={() => navigate(feat.route)}
              className="mission-card p-3 cursor-pointer hover:scale-[1.02] transition-transform group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="p-1.5 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feat.color}18`, color: feat.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`status-${feat.status}`}>
                    {feat.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {feat.title}
                </h4>

                <p className="mono-data text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {feat.value}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  {feat.sub}
                </p>
              </div>

              {/* Sparkline */}
              <div className="h-8 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData.slice(-8)}>
                    <Line
                      type="monotone"
                      dataKey={feat.dataKey}
                      stroke={feat.color}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
