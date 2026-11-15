import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Heart, Brain, Droplets, Shield, Radio, Wind, Sparkles } from 'lucide-react'

export default function SpacesuitDiagramSvg({ vitals, statuses }) {
  const navigate = useNavigate()
  const [hoveredRegion, setHoveredRegion] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#EF4444' // Red
      case 'caution':
      case 'warning': return '#F59E0B' // Yellow
      case 'nominal':
      default: return '#22C55E' // Green
    }
  }

  const headStatus = statuses?.temp === 'critical' || statuses?.stress === 'critical'
    ? 'critical'
    : (statuses?.temp === 'caution' || statuses?.stress === 'caution' ? 'caution' : 'nominal')

  const chestStatus = statuses?.hr === 'critical' || statuses?.spo2 === 'critical' || statuses?.resp === 'critical'
    ? 'critical'
    : (statuses?.hr === 'caution' || statuses?.spo2 === 'caution' || statuses?.resp === 'caution' ? 'caution' : 'nominal')

  const armsStatus = statuses?.bp || 'nominal'
  const abdomenStatus = statuses?.hydration || 'nominal'

  const legsStatus = statuses?.bone === 'critical' || statuses?.muscle === 'critical'
    ? 'critical'
    : (statuses?.bone === 'caution' || statuses?.muscle === 'caution' ? 'caution' : 'nominal')

  const skinStatus = statuses?.radiation || 'nominal'

  const regions = [
    {
      id: 'head',
      label: 'Head & Helmet',
      route: '/tabs/neuro-cognitive',
      status: headStatus,
      color: getStatusColor(headStatus),
      telemetry: `Core Temp: ${vitals?.coreTemp || 36.7}°C | Cognition: ${vitals?.cognitiveScore || 92}%`,
      subtext: 'EEG Neural Telemetry, SANS Intracranial Pressure & Core Temp',
      icon: Brain
    },
    {
      id: 'chest',
      label: 'Chest & Bio-Harness',
      route: '/tabs/cardiovascular',
      status: chestStatus,
      color: getStatusColor(chestStatus),
      telemetry: `HR: ${vitals?.hr || 72} bpm | SpO₂: ${vitals?.spo2 || 98}% | Resp: ${vitals?.resp || 15} br/min`,
      subtext: 'Lead-II Surface ECG, Transthoracic Respiration & O₂ Saturation',
      icon: Heart
    },
    {
      id: 'arms',
      label: 'Arms & Brachial Cuff',
      route: '/tabs/cardiovascular',
      status: armsStatus,
      color: getStatusColor(armsStatus),
      telemetry: `BP: ${vitals?.bpSys || 118}/${vitals?.bpDia || 76} mmHg`,
      subtext: 'Brachial Sphygmomanometer & Forearm Electromyography',
      icon: Activity
    },
    {
      id: 'abdomen',
      label: 'Abdomen & Metabolism',
      route: '/tabs/nutrition',
      status: abdomenStatus,
      color: getStatusColor(abdomenStatus),
      telemetry: `Hydration: ${vitals?.hydration || 91}% | Energy: 2,800 kcal`,
      subtext: 'Fluid Homeostasis, Gastrointestinal Absorption & Metabolic Flux',
      icon: Droplets
    },
    {
      id: 'legs',
      label: 'Lower Extremities & Skeleton',
      route: '/tabs/musculoskeletal',
      status: legsStatus,
      color: getStatusColor(legsStatus),
      telemetry: `Bone Density: ${vitals?.boneDensity || 98}% | Muscle Mass: ${vitals?.muscleMass || 96}%`,
      subtext: 'ARED Load Mitigation, Calcaneus DXA & Soleus Volume Loss',
      icon: Activity
    },
    {
      id: 'skin',
      label: 'Suit Exterior & Dosimetry',
      route: '/tabs/radiation',
      status: skinStatus,
      color: getStatusColor(skinStatus),
      telemetry: `Radiation: ${vitals?.radiationRate || 0.042} mSv/hr | Shield: Active`,
      subtext: 'Thermo-Electric Layer, TEPC Dosimeter & Micrometeoroid Protection',
      icon: Radio
    }
  ]

  const activeRegionData = regions.find(r => r.id === hoveredRegion)

  return (
    <div className="mission-card flex flex-col items-center relative overflow-hidden">
      {/* Title */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-nasa-blue dark:text-nasa-blueLight" />
          <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            EXPLORATION SPACESUIT BIO-TELEMETRY (2D DIAGRAM)
          </h3>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
          TAP REGION FOR MODULE
        </span>
      </div>

      {/* Interactive SVG Diagram */}
      <div className="relative w-full max-w-[320px] h-[340px] flex items-center justify-center my-2">
        <svg
          viewBox="0 0 280 340"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Silhouette Background */}
          <path
            d="M140 22 C125 22 112 34 112 50 C112 66 125 78 140 78 C155 78 168 66 168 50 C168 34 155 22 140 22 Z"
            fill="#1A2742"
            opacity="0.3"
          />

          {/* SPACESUIT TORSO & LIMBS SILHOUETTE */}
          <g stroke="#263859" strokeWidth="2.5" fill="#0B1220" opacity="0.9">
            {/* Torso */}
            <path d="M105 84 L175 84 L185 180 L95 180 Z" rx="10" />
            {/* Left Arm */}
            <path d="M98 88 L58 135 L42 195 L60 200 L76 150 L102 110" strokeLinejoin="round" />
            {/* Right Arm */}
            <path d="M182 88 L222 135 L238 195 L220 200 L204 150 L178 110" strokeLinejoin="round" />
            {/* Left Leg */}
            <path d="M105 180 L96 260 L85 315 L118 318 L128 260 L135 185" strokeLinejoin="round" />
            {/* Right Leg */}
            <path d="M175 180 L184 260 L195 315 L162 318 L152 260 L145 185" strokeLinejoin="round" />
          </g>

          {/* INTERACTIVE REGION SENSOR NODES & TARGETS */}

          {/* 1. HEAD / HELMET */}
          <g
            className="cursor-pointer group"
            onClick={() => navigate('/tabs/neuro-cognitive')}
            onMouseEnter={() => setHoveredRegion('head')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <circle
              cx="140"
              cy="50"
              r="26"
              fill={hoveredRegion === 'head' ? 'rgba(30, 107, 255, 0.25)' : 'rgba(26, 39, 66, 0.4)'}
              stroke={regions[0].color}
              strokeWidth="2.5"
              className="transition-all duration-200"
            />
            {/* Pulse Ring */}
            <circle cx="140" cy="50" r="32" stroke={regions[0].color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" className="animate-spin-slow" />
            <text x="140" y="54" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">HEAD</text>
          </g>

          {/* 2. CHEST / BIO-HARNESS */}
          <g
            className="cursor-pointer group"
            onClick={() => navigate('/tabs/cardiovascular')}
            onMouseEnter={() => setHoveredRegion('chest')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="115"
              y="100"
              width="50"
              height="45"
              rx="8"
              fill={hoveredRegion === 'chest' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(26, 39, 66, 0.4)'}
              stroke={regions[1].color}
              strokeWidth="2.5"
              className="transition-all duration-200"
            />
            <circle cx="140" cy="122" r="6" fill={regions[1].color} className="animate-pulse" />
            <text x="140" y="138" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">CHEST</text>
          </g>

          {/* 3. ARMS / BP */}
          <g
            className="cursor-pointer group"
            onClick={() => navigate('/tabs/cardiovascular')}
            onMouseEnter={() => setHoveredRegion('arms')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <circle cx="62" cy="145" r="14" fill="rgba(26, 39, 66, 0.6)" stroke={regions[2].color} strokeWidth="2" />
            <circle cx="218" cy="145" r="14" fill="rgba(26, 39, 66, 0.6)" stroke={regions[2].color} strokeWidth="2" />
            <text x="62" y="148" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">BP</text>
            <text x="218" y="148" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">BP</text>
          </g>

          {/* 4. ABDOMEN / HYDRATION */}
          <g
            className="cursor-pointer group"
            onClick={() => navigate('/tabs/nutrition')}
            onMouseEnter={() => setHoveredRegion('abdomen')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="118"
              y="155"
              width="44"
              height="28"
              rx="6"
              fill={hoveredRegion === 'abdomen' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(26, 39, 66, 0.4)'}
              stroke={regions[3].color}
              strokeWidth="2"
            />
            <text x="140" y="172" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">H₂O / MET</text>
          </g>

          {/* 5. LEGS / BONES */}
          <g
            className="cursor-pointer group"
            onClick={() => navigate('/tabs/musculoskeletal')}
            onMouseEnter={() => setHoveredRegion('legs')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect x="94" y="220" width="28" height="50" rx="6" fill="rgba(26, 39, 66, 0.4)" stroke={regions[4].color} strokeWidth="2" />
            <rect x="158" y="220" width="28" height="50" rx="6" fill="rgba(26, 39, 66, 0.4)" stroke={regions[4].color} strokeWidth="2" />
            <text x="108" y="248" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">BONE</text>
            <text x="172" y="248" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">ARED</text>
          </g>

          {/* 6. SUIT / DOSIMETER BADGE */}
          <g
            className="cursor-pointer group"
            onClick={() => navigate('/tabs/radiation')}
            onMouseEnter={() => setHoveredRegion('skin')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <circle cx="166" cy="98" r="10" fill="#0B1220" stroke={regions[5].color} strokeWidth="2" />
            <text x="166" y="101" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">RAD</text>
          </g>
        </svg>
      </div>

      {/* Dynamic Hover Tooltip Card */}
      <div className="w-full min-h-[58px] p-2.5 rounded-lg bg-gray-50 dark:bg-space-800 border border-gray-200 dark:border-space-700 flex items-center justify-between transition-all">
        {activeRegionData ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 animate-ping"
              style={{ backgroundColor: activeRegionData.color }}
            />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{activeRegionData.label}</span>
                <span className="text-[10px] uppercase font-semibold mono-data" style={{ color: activeRegionData.color }}>
                  [{activeRegionData.status}]
                </span>
              </p>
              <p className="text-[11px] mono-data text-nasa-blue dark:text-nasa-blueLight font-semibold">
                {activeRegionData.telemetry}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center w-full text-xs text-gray-400">
            Hover over any suit node to inspect biometrics • Click node to open module
          </div>
        )}
      </div>
    </div>
  )
}
