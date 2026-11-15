import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <div className="p-4 rounded-full bg-nasa-blue/10 dark:bg-nasa-blueLight/20 text-nasa-blue dark:text-nasa-blueLight animate-bounce">
        <Rocket className="w-12 h-12" />
      </div>
      <h1 className="heading-display text-4xl font-extrabold text-gray-900 dark:text-white">
        404 - TRAJECTORY LOST
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
        The requested deep-space telemetry sector does not exist or has fallen out of Deep Space Network alignment.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Mission Dashboard</span>
      </button>
    </div>
  )
}
