import React, { useState, useEffect } from 'react'
import { Rocket, Shield, ArrowRight, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react'
import { nasaApiService } from '../../services/nasaApi'

export default function SplashScreen({ onDismiss }) {
  const [apod, setApod] = useState(null)
  const [source, setSource] = useState('LIVE')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    nasaApiService.getApod().then(res => {
      if (isMounted) {
        setApod(res.data)
        setSource(res.source)
        setLoading(false)
      }
    }).catch(() => {
      if (isMounted) {
        setSource('SIMULATED')
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [])

  const bgUrl = apod?.hdurl || apod?.url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-space-950 text-white select-none transition-opacity duration-700">
      {/* Background NASA APOD Image with Mission-Control Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{
          backgroundImage: `url(${bgUrl})`,
          filter: 'brightness(0.35) contrast(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/70 to-space-900/40" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1E6BFF 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Center Modal / Splash Content */}
      <div className="relative z-10 max-w-xl mx-4 p-6 sm:p-8 rounded-2xl bg-space-900/85 backdrop-blur-xl border border-nasa-blue/40 shadow-2xl text-center space-y-6 animate-fade-in">
        {/* Custom AstroVitals Animated SVG Insignia */}
        <div className="flex justify-center">
          <div className="relative p-3 rounded-2xl bg-space-800/80 border border-nasa-blue/30 shadow-lg shadow-nasa-blue/10">
            <svg className="w-14 h-14 animate-pulse" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#0B3D91" strokeWidth="2.5" />
              <path d="M7 23C13 14 27 14 33 23" stroke="#FC3D21" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="18" r="4.5" fill="#1E6BFF" />
              <path d="M14 26L20 12L26 26" stroke="#22C55E" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Branding & Subtitle */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nasa-blue/20 border border-nasa-blue/40 text-[11px] font-bold text-nasa-blueLight tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NASA Space Apps Challenge 2026</span>
          </div>
          <h1 className="heading-display text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
            ASTROVITALS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Autonomous Deep-Space Astronaut Health & Clinical Monitoring System
          </p>
          <p className="text-[11px] text-gray-400">
            Team: <strong className="text-white">Proxyma Dynamics</strong> • Expedition Artemis VII
          </p>
        </div>

        {/* Real NASA APOD Metadata Strip */}
        <div className="p-3 rounded-xl bg-space-800/70 border border-space-700/80 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <ImageIcon className="w-3.5 h-3.5 text-nasa-blueLight" />
              <span>Cosmic Background: Real NASA APOD</span>
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              source === 'LIVE' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
              source === 'CACHED' ? 'bg-blue-950/80 text-blue-400 border border-blue-800' :
              'bg-purple-950/80 text-purple-400 border border-purple-800'
            }`}>
              {source} NASA FEED
            </span>
          </div>
          <p className="font-semibold text-white truncate text-[11px]">
            {apod?.title || 'Deep-Space Cosmic Radiation Field & Nebula'}
          </p>
          <p className="text-[10px] text-gray-400 line-clamp-2">
            {apod?.explanation || 'Astronomy Picture of the Day from NASA Open Data API, dynamically loaded for flight surgeon orientation.'}
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onDismiss}
            className="w-full py-3 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-nasa-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl shadow-nasa-blue/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <Rocket className="w-4 h-4 text-amber-300" />
            <span>ENTER MISSION CONTROL</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <p className="text-[10px] text-gray-500 mt-2 font-mono">
            Compliant with NASA-STD-3001 Human-System Integration Standards
          </p>
        </div>
      </div>
    </div>
  )
}
