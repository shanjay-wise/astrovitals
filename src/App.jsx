import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout'

// Lazy-loaded routes for performance & Lighthouse 90+ target
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CrewOverviewPage = lazy(() => import('./pages/CrewOverviewPage'))
const AlertsPage = lazy(() => import('./pages/AlertsPage'))
const DataSourcesPage = lazy(() => import('./pages/DataSourcesPage'))

// 12 Feature Tabs
const CardiovascularTab = lazy(() => import('./pages/tabs/CardiovascularTab'))
const RespiratoryTab = lazy(() => import('./pages/tabs/RespiratoryTab'))
const TemperatureTab = lazy(() => import('./pages/tabs/TemperatureTab'))
const SleepCircadianTab = lazy(() => import('./pages/tabs/SleepCircadianTab'))
const RadiationTab = lazy(() => import('./pages/tabs/RadiationTab'))
const MusculoskeletalTab = lazy(() => import('./pages/tabs/MusculoskeletalTab'))
const NeuroCognitiveTab = lazy(() => import('./pages/tabs/NeuroCognitiveTab'))
const MentalHealthTab = lazy(() => import('./pages/tabs/MentalHealthTab'))
const NutritionHydrationTab = lazy(() => import('./pages/tabs/NutritionHydrationTab'))
const FluidShiftVisionTab = lazy(() => import('./pages/tabs/FluidShiftVisionTab'))
const HabitatEnvironmentTab = lazy(() => import('./pages/tabs/HabitatEnvironmentTab'))
const MedicalLogTab = lazy(() => import('./pages/tabs/MedicalLogTab'))

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Skeleton Loading Fallback
function LoadingFallback() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-space-800 rounded-lg w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-space-800 rounded-lg w-1/2" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <div className="h-28 bg-gray-200 dark:bg-space-800 rounded-xl" />
        <div className="h-28 bg-gray-200 dark:bg-space-800 rounded-xl" />
        <div className="h-28 bg-gray-200 dark:bg-space-800 rounded-xl" />
        <div className="h-28 bg-gray-200 dark:bg-space-800 rounded-xl" />
      </div>
      <div className="h-64 bg-gray-200 dark:bg-space-800 rounded-xl mt-6" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="crew" element={<CrewOverviewPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="sources" element={<DataSourcesPage />} />

          {/* 12 Subsystem Tabs */}
          <Route path="tabs/cardiovascular" element={<CardiovascularTab />} />
          <Route path="tabs/respiratory" element={<RespiratoryTab />} />
          <Route path="tabs/temperature" element={<TemperatureTab />} />
          <Route path="tabs/sleep" element={<SleepCircadianTab />} />
          <Route path="tabs/radiation" element={<RadiationTab />} />
          <Route path="tabs/musculoskeletal" element={<MusculoskeletalTab />} />
          <Route path="tabs/neuro-cognitive" element={<NeuroCognitiveTab />} />
          <Route path="tabs/mental-health" element={<MentalHealthTab />} />
          <Route path="tabs/nutrition" element={<NutritionHydrationTab />} />
          <Route path="tabs/fluid-shift" element={<FluidShiftVisionTab />} />
          <Route path="tabs/habitat" element={<HabitatEnvironmentTab />} />
          <Route path="tabs/medical-log" element={<MedicalLogTab />} />

          {/* Backward compatibility redirects */}
          <Route path="vitals" element={<Navigate to="/tabs/cardiovascular" replace />} />
          <Route path="emotions" element={<Navigate to="/tabs/mental-health" replace />} />
          <Route path="supplies" element={<Navigate to="/tabs/habitat" replace />} />
          <Route path="radiation" element={<Navigate to="/tabs/radiation" replace />} />
          <Route path="activity" element={<Navigate to="/tabs/musculoskeletal" replace />} />
          <Route path="nasa-research" element={<Navigate to="/sources" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
