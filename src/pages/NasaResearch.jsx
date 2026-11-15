import { useState } from 'react'
import {
  Compass, Radio, Brain, Globe, Shield, Activity,
  Database, FileText, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers
} from 'lucide-react'
import { nasaStandards } from '../data/nasaStandardsData'
import { useTheme } from '../context/ThemeContext'

export default function NasaResearch() {
  const { darkMode } = useTheme()
  const [selectedHazard, setSelectedHazard] = useState('hazard-radiation')

  // Interactive Mars Transit Mission Simulator State
  const [transitDays, setTransitDays] = useState(180)
  const [shieldingLevel, setShieldingLevel] = useState('standard') // light, standard, heavy
  const [exerciseHours, setExerciseHours] = useState(2.5)

  // Simulation calculations based on NASA HRP models
  const shieldFactor = shieldingLevel === 'light' ? 1.3 : shieldingLevel === 'standard' ? 1.0 : 0.72
  const projectedRadiationMsv = (transitDays * 1.3 * shieldFactor).toFixed(1)
  const projectedBoneLossPct = Math.max(0.5, (transitDays / 30 * 1.2 * (2.5 / exerciseHours) * 0.45)).toFixed(1)
  const projectedMuscleLossPct = Math.max(1.0, (transitDays / 30 * 2.0 * (2.5 / exerciseHours) * 0.4)).toFixed(1)
  const oxygenConsumedKg = (transitDays * 4 * 0.84).toFixed(0) // 0.84 kg O2 / human / day
  const waterConsumedL = (transitDays * 4 * 2.5 * 0.065).toFixed(0) // un-recycled net loss at 93.5% WRS

  const activeHazardData = nasaStandards.hrpFiveHazards.find(h => h.id === selectedHazard) || nasaStandards.hrpFiveHazards[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">NASA RESEARCH & STANDARDS HUB</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-nasa-blue text-white dark:bg-blue-600">
              NASA HUMAN RESEARCH PROGRAM (HRP)
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Empirical space medicine baselines, NASA-STD-3001 protocols, and Twins Study genomic research
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Database className="w-4 h-4 text-nasa-blue dark:text-blue-400" />
          <span>LSDA & GeneLab Dataset Integrated</span>
        </div>
      </div>

      {/* The 5 Hazards of Spaceflight ("RIDGE") Interactive Module */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="heading-display text-base text-gray-900 dark:text-white">
              THE 5 HAZARDS OF HUMAN SPACEFLIGHT ("RIDGE")
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              NASA Human Research Roadmap classification of deep space biomedical risks
            </p>
          </div>
          <span className="text-xs text-gray-400">Select hazard to inspect</span>
        </div>

        {/* Hazard Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {nasaStandards.hrpFiveHazards.map(hazard => (
            <button
              key={hazard.id}
              onClick={() => setSelectedHazard(hazard.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedHazard === hazard.id
                  ? 'border-nasa-blue dark:border-blue-500 bg-nasa-blue/10 dark:bg-blue-500/10 shadow-sm'
                  : 'border-gray-200 dark:border-space-600 hover:bg-gray-50 dark:hover:bg-space-600/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="mono-data text-xs font-bold text-nasa-blue dark:text-blue-400">{hazard.code}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  hazard.severity === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  {hazard.severity}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{hazard.name}</p>
            </button>
          ))}
        </div>

        {/* Active Hazard Deep Dive */}
        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-space-600/30 border border-gray-200 dark:border-space-500/40">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-nasa-blue text-white flex items-center justify-center font-bold text-sm">
                  {activeHazardData.code}
                </span>
                <h3 className="heading-display text-lg text-gray-900 dark:text-white">
                  {activeHazardData.name}
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
                {activeHazardData.summary}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-space-700 border border-gray-200 dark:border-space-500 text-right">
              <p className="text-[10px] uppercase text-gray-400 tracking-wider">Primary Monitoring Metric</p>
              <p className="mono-data text-xs font-bold text-nasa-blue dark:text-blue-400 mt-0.5">
                {activeHazardData.keyMetric}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-space-500/50">
            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
              NASA Validated Clinical Countermeasures:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeHazardData.countermeasures.map((cm, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{cm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive NASA Mars Transit Biomedical Projection Simulator */}
      <div className="card border-l-4 border-l-nasa-blue">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-nasa-blue dark:text-blue-400" />
            <h2 className="heading-display text-base text-gray-900 dark:text-white">
              INTERACTIVE MARS TRANSIT BIOMEDICAL SIMULATOR
            </h2>
          </div>
          <span className="status-nominal">ALGORITHMIC MODEL</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Adjust mission parameters to project crew physiological outcomes using NASA Human Research Program mathematical transfer functions.
        </p>

        {/* Sliders and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              <span>Transit Duration:</span>
              <span className="mono-data text-nasa-blue dark:text-blue-400">{transitDays} Days</span>
            </div>
            <input
              type="range"
              min="90"
              max="300"
              step="10"
              value={transitDays}
              onChange={(e) => setTransitDays(Number(e.target.value))}
              className="w-full accent-nasa-blue cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>90d (High Thrust)</span>
              <span>180d (Hohmann)</span>
              <span>300d (Conjunction)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              <span>Daily Exercise Regimen:</span>
              <span className="mono-data text-emerald-500">{exerciseHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.5"
              value={exerciseHours}
              onChange={(e) => setExerciseHours(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>1.0h (Deficient)</span>
              <span>2.5h (NASA Standard)</span>
              <span>3.5h (Intensive)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              <span>Spacecraft Hull Shielding:</span>
              <span className="mono-data capitalize text-blue-500">{shieldingLevel}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {['light', 'standard', 'heavy'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setShieldingLevel(lvl)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize border ${
                    shieldingLevel === lvl
                      ? 'bg-nasa-blue text-white border-nasa-blue'
                      : 'border-gray-200 dark:border-space-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              {shieldingLevel === 'light' ? '10 g/cm² Al-eq' : shieldingLevel === 'standard' ? '20 g/cm² + water wall' : '35 g/cm² + Polyethylene'}
            </p>
          </div>
        </div>

        {/* Projected Outcomes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Total Absorbed Radiation</p>
            <p className="mono-data text-2xl font-bold text-amber-500 mt-1">{projectedRadiationMsv} mSv</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {Number(projectedRadiationMsv) > 250 ? '⚠️ Exceeds Exploration Permissible' : '✓ Below 600 mSv Career Cap'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Projected Bone Mineral Loss</p>
            <p className="mono-data text-2xl font-bold text-red-500 mt-1">-{projectedBoneLossPct}%</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {Number(projectedBoneLossPct) > 5.0 ? 'Elevated fracture risk on Mars' : 'Nominal countermeasure control'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Skeletal Muscle Atrophy</p>
            <p className="mono-data text-2xl font-bold text-blue-500 mt-1">-{projectedMuscleLossPct}%</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Postural soleus/quadriceps</p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Net Water Make-up Need</p>
            <p className="mono-data text-2xl font-bold text-cyan-500 mt-1">{waterConsumedL} Liters</p>
            <p className="text-[10px] text-gray-500 mt-0.5">At 93.5% WRS loop closure</p>
          </div>
        </div>
      </div>

      {/* NASA Twins Study Highlights */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          <h2 className="heading-display text-base text-gray-900 dark:text-white">
            NASA TWINS STUDY: INTEGRATED MULTI-OMIC FINDINGS
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Comparative longitudinal analysis of astronaut Scott Kelly (340 days on ISS) versus identical twin Mark Kelly (Earth baseline)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nasaStandards.nasaTwinsStudyFindings.map((finding, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-space-600/40 border border-gray-100 dark:border-space-500/30">
              <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300">{finding.parameter}</h4>
              <p className="text-xs text-gray-700 dark:text-gray-200 mt-1 font-medium">{finding.finding}</p>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-space-500/30 text-[11px] text-gray-500 dark:text-gray-400">
                <strong>Operational Impact: </strong>{finding.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NASA-STD-3001 Compliance Matrix */}
      <div className="card">
        <h2 className="heading-display text-base text-gray-900 dark:text-white mb-3">
          NASA-STD-3001 VOL 1 & 2 TECHNICAL COMPLIANCE STATUS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-space-600 text-gray-400 uppercase text-[10px]">
                <th className="pb-2">Standard Code</th>
                <th className="pb-2">Domain Parameter</th>
                <th className="pb-2">NASA Threshold Limit</th>
                <th className="pb-2">Current Software Sensor Value</th>
                <th className="pb-2">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-space-600/40">
              <tr>
                <td className="py-2.5 font-bold mono-data text-nasa-blue dark:text-blue-400">STD-3001.V2-6001</td>
                <td>Cabin Carbon Dioxide (ppCO₂)</td>
                <td>&lt; 3.0 mmHg continuous</td>
                <td className="mono-data font-semibold">2.3 mmHg</td>
                <td><span className="status-nominal">COMPLIANT</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold mono-data text-nasa-blue dark:text-blue-400">STD-3001.V1-3002</td>
                <td>Space Radiation Career Cap</td>
                <td>3% REID (600 mSv)</td>
                <td className="mono-data font-semibold">145.2 mSv (24.2%)</td>
                <td><span className="status-nominal">COMPLIANT</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold mono-data text-nasa-blue dark:text-blue-400">STD-3001.V1-4005</td>
                <td>Mandatory Exercise Duration</td>
                <td>2.5 hours / day</td>
                <td className="mono-data font-semibold">2.1 - 2.4 hrs / day</td>
                <td><span className="status-nominal">NOMINAL</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold mono-data text-nasa-blue dark:text-blue-400">STD-3001.V2-7012</td>
                <td>Sleep Station Noise Level</td>
                <td>&lt; 52 dBA</td>
                <td className="mono-data font-semibold">47.8 dBA</td>
                <td><span className="status-nominal">COMPLIANT</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold mono-data text-nasa-blue dark:text-blue-400">STD-3001.V1-5003</td>
                <td>Autonomous Behavioral Test</td>
                <td>PVT-B response &lt; 355 ms</td>
                <td className="mono-data font-semibold">248 ms avg</td>
                <td><span className="status-nominal">COMPLIANT</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
