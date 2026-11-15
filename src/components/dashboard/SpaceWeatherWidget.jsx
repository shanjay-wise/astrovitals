import React, { useState, useEffect } from 'react'
import { Sun, Radio, Shield, AlertTriangle, ExternalLink, RefreshCw, Zap, Wind } from 'lucide-react'
import { nasaApiService } from '../../services/nasaApi'

export default function SpaceWeatherWidget() {
  const [events, setEvents] = useState([])
  const [source, setSource] = useState('LIVE')
  const [loading, setLoading] = useState(true)

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const res = await nasaApiService.getSpaceWeather(30)
      setEvents(res.events.slice(0, 4))
      setSource(res.source)
    } catch (err) {
      console.error('[SpaceWeatherWidget] Error:', err)
      setSource('SIMULATED')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  return (
    <div className="mission-card w-full max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
          <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
            HELIOSPHERIC SPACE WEATHER
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
            source === 'LIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' :
            source === 'CACHED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800' :
            'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-300 dark:border-purple-800'
          }`}>
            {source}
          </span>
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Refresh NASA DONKI 30-day stream"
            aria-label="Refresh Space Weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-nasa-blue' : ''}`} />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Real-time Solar Flares (FLR) and Coronal Mass Ejections (CME) from NASA DONKI over the last 30 days along the Mars transit trajectory.
      </p>

      {/* Events List */}
      <div className="space-y-2">
        {events.length === 0 && !loading ? (
          <div className="p-3 text-center text-xs text-gray-400">
            No significant solar events in the last 30 days
          </div>
        ) : (
          events.map((evt, idx) => {
            const isFlr = evt.type === 'FLR'
            const isXClass = evt.classType?.startsWith('X')
            const isMClass = evt.classType?.startsWith('M')

            return (
              <div
                key={evt.id || idx}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-100 dark:border-space-700 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mono-data flex items-center gap-1 ${
                    isFlr
                      ? (isXClass ? 'bg-red-500 text-white' : isMClass ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white')
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {isFlr ? <Zap className="w-2.5 h-2.5" /> : <Wind className="w-2.5 h-2.5" />}
                    <span>{evt.classType || evt.type}</span>
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {evt.typeLabel} • {evt.sourceLocation || 'Solar Corona'}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {evt.note}
                    </p>
                  </div>
                </div>
                <span className="mono-data text-[10px] text-gray-400 whitespace-nowrap">
                  {evt.time ? new Date(evt.time).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent'}
                </span>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-space-800 flex items-center justify-between text-[10px] text-gray-400">
        <span>Data: NASA CCMC DONKI</span>
        <a
          href="https://ccmc.gsfc.nasa.gov/DONKI/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Space Weather Center <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  )
}
