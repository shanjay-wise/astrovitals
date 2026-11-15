import React, { useState, useEffect } from 'react'
import { User, X, Check, Trash2, Heart, Scale, Shield } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'

export default function AstronautProfileModal({ isOpen, astronaut, onClose }) {
  const { addAstronaut, updateAstronaut, deleteAstronaut, astronauts } = useAstroStore()

  const [form, setForm] = useState({
    name: '',
    role: 'Mission Specialist',
    age: 36,
    sex: 'female',
    heightCm: 172,
    weightKg: 65,
    bloodType: 'O+',
    avatar: '👩‍🚀',
    mission: 'Artemis VII - Mars Transit',
    missionDay: 147,
    baselines: {
      hr: 70,
      hrv: 48,
      bpSys: 118,
      bpDia: 76,
      spo2: 98.2,
      resp: 15,
      coreTemp: 36.7,
      sleepHrs: 7.5,
      boneDensity: 99.0,
      muscleMass: 98.0,
      hydration: 92.0
    }
  })

  useEffect(() => {
    if (astronaut) {
      setForm(astronaut)
    } else {
      setForm({
        name: '',
        role: 'Mission Specialist',
        age: 36,
        sex: 'female',
        heightCm: 172,
        weightKg: 65,
        bloodType: 'O+',
        avatar: '👩‍🚀',
        mission: 'Artemis VII - Mars Transit',
        missionDay: 147,
        baselines: {
          hr: 70,
          hrv: 48,
          bpSys: 118,
          bpDia: 76,
          spo2: 98.2,
          resp: 15,
          coreTemp: 36.7,
          sleepHrs: 7.5,
          boneDensity: 99.0,
          muscleMass: 98.0,
          hydration: 92.0
        }
      })
    }
  }, [astronaut])

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return

    if (astronaut) {
      updateAstronaut(astronaut.id, form)
    } else {
      addAstronaut(form)
    }
    onClose()
  }

  const handleDelete = () => {
    if (astronaut && astronauts.length > 1) {
      if (confirm(`Confirm deletion of astronaut profile ${astronaut.name}?`)) {
        deleteAstronaut(astronaut.id)
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 rounded-2xl w-full max-w-xl max-h-[calc(100dvh-2.5rem)] my-auto flex flex-col overflow-hidden shadow-2xl">
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-nasa-blue to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-5 h-5 shrink-0" />
            <h3 className="heading-display text-xs sm:text-sm font-bold truncate">
              {astronaut ? `EDIT ASTRONAUT: ${astronaut.name}` : 'ENROLL NEW EXPEDITION ASTRONAUT'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 text-blue-200 hover:text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Elena Rostova"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Mission Role</label>
              <input
                type="text"
                required
                placeholder="e.g. Flight Surgeon"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Age</label>
              <input
                type="number"
                min="25"
                max="65"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Sex</label>
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Avatar Emoji</label>
              <select
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              >
                <option value="👩‍🚀">👩‍🚀 Astronaut Female</option>
                <option value="👨‍🚀">👨‍🚀 Astronaut Male</option>
                <option value="👩‍🔬">👩‍🔬 Scientist Female</option>
                <option value="👨‍🔧">👨‍🔧 Engineer Male</option>
                <option value="🧑‍🚀">🧑‍🚀 Astronaut Neutral</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Blood Type</label>
              <select
                value={form.bloodType}
                onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
              </select>
            </div>
          </div>

          {/* NASA Physiological Baselines */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-200 dark:border-space-700 space-y-2">
            <h4 className="font-bold text-nasa-blue dark:text-nasa-blueLight uppercase text-[10px]">
              Pre-Flight Physiological Baselines (NASA Standards)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-gray-400">Resting HR (bpm)</label>
                <input
                  type="number"
                  value={form.baselines.hr}
                  onChange={(e) => setForm({ ...form, baselines: { ...form.baselines, hr: Number(e.target.value) } })}
                  className="w-full px-2 py-1 rounded border border-gray-200 dark:border-space-700 bg-white dark:bg-space-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400">Resting HRV (ms)</label>
                <input
                  type="number"
                  value={form.baselines.hrv}
                  onChange={(e) => setForm({ ...form, baselines: { ...form.baselines, hrv: Number(e.target.value) } })}
                  className="w-full px-2 py-1 rounded border border-gray-200 dark:border-space-700 bg-white dark:bg-space-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400">BP Systolic</label>
                <input
                  type="number"
                  value={form.baselines.bpSys}
                  onChange={(e) => setForm({ ...form, baselines: { ...form.baselines, bpSys: Number(e.target.value) } })}
                  className="w-full px-2 py-1 rounded border border-gray-200 dark:border-space-700 bg-white dark:bg-space-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400">Target Sleep (h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.baselines.sleepHrs}
                  onChange={(e) => setForm({ ...form, baselines: { ...form.baselines, sleepHrs: Number(e.target.value) } })}
                  className="w-full px-2 py-1 rounded border border-gray-200 dark:border-space-700 bg-white dark:bg-space-900"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-gray-100 dark:border-space-700 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {astronaut && astronauts.length > 1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                <span>Delete Profile</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-gray-100 dark:bg-space-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-nasa-blue text-white hover:bg-blue-700 font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
