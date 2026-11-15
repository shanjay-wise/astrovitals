import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Package, Wind, Droplets, Battery, Zap, ShieldAlert,
  CheckCircle, ArrowUpRight, AlertTriangle, RefreshCw, Layers
} from 'lucide-react'
import { supplyConfig, generateSupplyForecast } from '../data/supplyData'
import { nasaStandards } from '../data/nasaStandardsData'
import { useTheme } from '../context/ThemeContext'
import GaugeChart from '../components/GaugeChart'

export default function SupplyTracker() {
  const { darkMode } = useTheme()
  const supplyForecast = generateSupplyForecast()
  const [selectedSystem, setSelectedSystem] = useState('all')

  const eclss = nasaStandards.eclss

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-display text-2xl text-gray-900 dark:text-white">ECLSS & LIFE SUPPORT SUPPLIES</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
              NASA ISS / ORION CLASS
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Environmental Control & Life Support System (ECLSS) consumables and regenerative recycling
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Station Consumables Status:</span>
          <span className="status-nominal">ALL SYSTEMS NOMINAL</span>
        </div>
      </div>

      {/* Primary ECLSS Systems Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Oxygen Generation */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Oxygen (OGA)</h3>
                <p className="text-[10px] text-gray-400">Electrolysis Cell Stack</p>
              </div>
            </div>
            <span className="status-nominal">NOMINAL</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
                {supplyConfig.oxygen.current}
              </span>
              <span className="text-sm text-gray-400 font-semibold">%</span>
            </div>
            <div className="text-right">
              <p className="mono-data text-xs font-bold text-blue-600 dark:text-blue-400">{supplyConfig.oxygen.daysRemaining} Days</p>
              <p className="text-[10px] text-gray-400">Buffer Reserves</p>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Cabin ppO₂:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">155 mmHg</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Generation Rate:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">5.4 kg O₂/day</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>LiOH Backup Canisters:</span>
              <span className="mono-data font-semibold text-emerald-500">18 units (Ready)</span>
            </div>
          </div>
        </div>

        {/* Water Recovery */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Water (WRS)</h3>
                <p className="text-[10px] text-gray-400">UPA + WPA Closed Loop</p>
              </div>
            </div>
            <span className="status-nominal">NOMINAL</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
                {supplyConfig.water.current}
              </span>
              <span className="text-sm text-gray-400 font-semibold">%</span>
            </div>
            <div className="text-right">
              <p className="mono-data text-xs font-bold text-cyan-600 dark:text-cyan-400">{supplyConfig.water.daysRemaining} Days</p>
              <p className="text-[10px] text-gray-400">Potable Storage</p>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Recycle Efficiency:</span>
              <span className="mono-data font-semibold text-emerald-500">{supplyConfig.water.recycleRate}% (Target: 98%)</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Conductivity / Purity:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">&lt;0.05 µS/cm</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Daily Allocation:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">2.5 L / crew / day</span>
            </div>
          </div>
        </div>

        {/* Food & Nutrition */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-500">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Food Rations</h3>
                <p className="text-[10px] text-gray-400">Retort & Freeze-Dried</p>
              </div>
            </div>
            <span className="status-nominal">NOMINAL</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
                {supplyConfig.food.current}
              </span>
              <span className="text-sm text-gray-400 font-semibold">%</span>
            </div>
            <div className="text-right">
              <p className="mono-data text-xs font-bold text-amber-600 dark:text-amber-400">{supplyConfig.food.daysRemaining} Days</p>
              <p className="text-[10px] text-gray-400">At 2800 kcal/day</p>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Caloric Density:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">3,000 kcal/pack</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Vit D3 & Calcium:</span>
              <span className="mono-data font-semibold text-emerald-500">800 IU daily intact</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Shelf-life Stability:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">94.2% nutrient retention</span>
            </div>
          </div>
        </div>

        {/* Power Systems */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Power & Solar</h3>
                <p className="text-[10px] text-gray-400">ROSA Solar + Li-ion</p>
              </div>
            </div>
            <span className="status-nominal">NOMINAL</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="mono-data text-3xl font-extrabold text-gray-900 dark:text-white">
                {supplyConfig.power.current}
              </span>
              <span className="text-sm text-gray-400 font-semibold">%</span>
            </div>
            <div className="text-right">
              <p className="mono-data text-xs font-bold text-emerald-600 dark:text-emerald-400">{supplyConfig.power.capacityKW} kW</p>
              <p className="text-[10px] text-gray-400">Array Generation</p>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Solar Array Output:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">{supplyConfig.power.solarOutput}% efficiency</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Battery Depth of Discharge:</span>
              <span className="mono-data font-semibold text-emerald-500">22% (Protected)</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Life Support Power Draw:</span>
              <span className="mono-data font-semibold text-gray-800 dark:text-gray-200">{supplyConfig.power.consumption} kW</span>
            </div>
          </div>
        </div>
      </div>

      {/* NASA Carbon Dioxide (CDRA) & Cabin Atmosphere Quality */}
      <div className="card border-l-4 border-l-blue-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="heading-display text-base text-gray-900 dark:text-white">
                CDRA CARBON DIOXIDE SCRUBBING & CABIN ATMOSPHERE
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                NASA-STD-3001 &lt;3.0 mmHg
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Continuous 4-bed molecular sieve (CDRA) scrub cycle to prevent hypercapnia, headache, and cognitive degradation
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Current ppCO₂</p>
              <p className="mono-data text-2xl font-bold text-emerald-500">{eclss.ppCO2.currentStationAverage} mmHg</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Max Permissible</p>
              <p className="mono-data text-2xl font-bold text-gray-600 dark:text-gray-400">3.0 mmHg</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-gray-400">Cabin Total Pressure</p>
            <p className="mono-data text-base font-bold text-gray-900 dark:text-white mt-1">14.7 psi (101.3 kPa)</p>
            <p className="text-[10px] text-emerald-500 mt-1">Sea level equivalent</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-gray-400">Relative Humidity</p>
            <p className="mono-data text-base font-bold text-gray-900 dark:text-white mt-1">44.8%</p>
            <p className="text-[10px] text-emerald-500 mt-1">NASA Spec: 35% - 60%</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-gray-400">Air Temperature</p>
            <p className="mono-data text-base font-bold text-gray-900 dark:text-white mt-1">21.8 °C (71.2 °F)</p>
            <p className="text-[10px] text-emerald-500 mt-1">Thermal comfort zone</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <p className="text-gray-400">Airborne Particulates</p>
            <p className="mono-data text-base font-bold text-gray-900 dark:text-white mt-1">0.02 mg/m³</p>
            <p className="text-[10px] text-emerald-500 mt-1">HEPA Grade 99.97%</p>
          </div>
        </div>
      </div>

      {/* 30-Day Forward Supply Depletion & Resupply Modeling */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-sm text-gray-900 dark:text-white">
            30-DAY FORWARD CONSUMABLE DEPLETION MODEL (O₂ / H₂O / RATIONS)
          </h3>
          <span className="text-xs text-blue-500 font-semibold">Resupply Cargo Drone T-63 Days</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Integrated metabolic consumption models based on active 4-person crew workload
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={supplyForecast}>
              <defs>
                <linearGradient id="o2ForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="waterForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="foodForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 10 }} stroke={darkMode ? '#64748b' : '#94a3b8'} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '10px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="oxygen" stroke="#3B82F6" strokeWidth={2} fill="url(#o2ForecastGrad)" name="Oxygen %" />
              <Area type="monotone" dataKey="water" stroke="#06B6D4" strokeWidth={2} fill="url(#waterForecastGrad)" name="Potable Water %" />
              <Area type="monotone" dataKey="food" stroke="#F59E0B" strokeWidth={2} fill="url(#foodForecastGrad)" name="Food Rations %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-8 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-blue-500" /> Oxygen Buffer</div>
          <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-cyan-500" /> Potable Water</div>
          <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-amber-500" /> Food Rations</div>
        </div>
      </div>

      {/* Emergency Medical Kit Inventory */}
      <div className="card">
        <h3 className="heading-display text-sm text-gray-900 dark:text-white mb-3">
          NASA CLASS IV MEDICAL PACK INVENTORY
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <span className="font-semibold text-gray-900 dark:text-white">Emergency Therapeutics</span>
            <p className="text-gray-400 mt-1">EpiPens, Broad Spectrum Antibiotics, Atropine, Morphine Analgesics</p>
            <p className="mono-data font-bold text-emerald-500 mt-2">100% Stock (Sealed)</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <span className="font-semibold text-gray-900 dark:text-white">IV Fluid Resuscitation</span>
            <p className="text-gray-400 mt-1">Normal Saline 0.9% and Ringer Lactate with reconstitution kits</p>
            <p className="mono-data font-bold text-emerald-500 mt-2">12 Liters Available</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <span className="font-semibold text-gray-900 dark:text-white">Diagnostic Ultrasound</span>
            <p className="text-gray-400 mt-1">Vivid-q ultrasound for cardiac, optic nerve sheath, and abdominal exam</p>
            <p className="mono-data font-bold text-emerald-500 mt-2">Operational (Calibrated)</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-600/40">
            <span className="font-semibold text-gray-900 dark:text-white">Automated Defibrillator</span>
            <p className="text-gray-400 mt-1">Microgravity-rated biphasic external defibrillator with pacing</p>
            <p className="mono-data font-bold text-emerald-500 mt-2">Battery: 99% (Self-tested)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
