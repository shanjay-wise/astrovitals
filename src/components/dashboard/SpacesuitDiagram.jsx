import React, { useState, Suspense, lazy } from 'react'
import SpacesuitDiagramSvg from './SpacesuitDiagramSvg'

// Lazy-load the interactive 3D astronaut component with React.lazy
const AstronautViewer3D = lazy(() => import('./AstronautViewer3D'))

/**
 * Robust WebGL Feature Detection
 */
function isWebGLAvailable() {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!(window.WebGLRenderingContext && gl)
  } catch {
    return false
  }
}

/**
 * Loading Skeleton displayed while the 3D canvas and model load
 */
function AstronautSkeleton() {
  return (
    <div className="mission-card flex flex-col items-center justify-between min-h-[480px] animate-pulse">
      {/* Header bar skeleton */}
      <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-space-800">
        <div className="h-4 bg-gray-200 dark:bg-space-800 rounded w-56" />
        <div className="h-5 bg-gray-200 dark:bg-space-800 rounded w-28" />
      </div>

      {/* 3D Viewport Skeleton */}
      <div className="relative w-full h-[360px] sm:h-[390px] rounded-xl bg-slate-900 border border-gray-200/80 dark:border-space-700/80 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-nasa-blue dark:border-nasa-blueLight border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest text-center px-4">
          INITIALIZING NASA 3D ASTRONAUT TELEMETRY...
        </span>
      </div>

      {/* Telemetry card skeleton */}
      <div className="w-full h-[58px] mt-2 rounded-lg bg-gray-200 dark:bg-space-800" />

      {/* Attribution skeleton */}
      <div className="w-2/3 h-3 bg-gray-200 dark:bg-space-800 rounded mt-2" />
    </div>
  )
}

/**
 * Error boundary that catches any WebGL or 3D rendering failures and falls back to 2D SVG
 */
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[SpacesuitDiagram] 3D Viewer error caught, displaying 2D fallback:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

/**
 * SpacesuitDiagram Component
 * Renders the Interactive 3D Astronaut viewer using NASA's 3D model,
 * with automatic fallback to the 2D SVG spacesuit diagram when WebGL is unavailable.
 */
export default function SpacesuitDiagram({ vitals, statuses }) {
  const [use2DFallback, setUse2DFallback] = useState(() => !isWebGLAvailable())

  // If WebGL is not available on this device/browser, or user switched to 2D
  if (use2DFallback) {
    return (
      <div className="relative w-full">
        <SpacesuitDiagramSvg vitals={vitals} statuses={statuses} />
        {isWebGLAvailable() && (
          <div className="absolute top-3 right-4 z-10">
            <button
              onClick={() => setUse2DFallback(false)}
              className="text-[10px] px-2 py-1 rounded-lg bg-nasa-blue text-white hover:bg-blue-600 font-mono transition-colors shadow-sm"
              title="Switch back to Interactive 3D Canvas"
            >
              Switch to 3D Canvas
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <WebGLErrorBoundary
      fallback={<SpacesuitDiagramSvg vitals={vitals} statuses={statuses} />}
    >
      <Suspense fallback={<AstronautSkeleton />}>
        <AstronautViewer3D
          vitals={vitals}
          statuses={statuses}
          onFallbackTo2D={() => setUse2DFallback(true)}
        />
      </Suspense>
    </WebGLErrorBoundary>
  )
}
