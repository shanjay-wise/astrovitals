import React, { useState } from 'react'
import { FileText, Download, Printer, ShieldCheck, Check, Clock, Plus, ExternalLink } from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import { exportService } from '../../services/exportService'

export default function MedicalLogTab() {
  const { astronauts, selectedAstronautId, currentVitals, alerts } = useAstroStore()
  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]

  const [clinicalNotes, setClinicalNotes] = useState([
    {
      id: 1,
      date: 'Day 146 16:00 UTC',
      author: 'Dr. James Rodriguez (Flight Surgeon)',
      entry: 'Routine bio-telemetry check. Cardiovascular adaptation stable. SANS fundoscopy demonstrates nominal optic disc contours without edema. Encouraged maintenance of ARED squat volume.',
      tag: 'Routine Exam'
    },
    {
      id: 2,
      date: 'Day 142 08:30 UTC',
      author: 'Mission Control Biomedical Ops',
      entry: 'Noted transient elevated resting heart rate (+14 bpm) following intensive EVA preparations. Serum electrolyte review nominal. Fluid rehydration protocol completed.',
      tag: 'Biomedical Follow-up'
    }
  ])

  const [newNote, setNewNote] = useState('')
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleAddNote = (e) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setClinicalNotes([
      {
        id: Date.now(),
        date: `Day ${currentAstro.missionDay} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC`,
        author: 'Dr. James Rodriguez (Flight Surgeon)',
        entry: newNote,
        tag: 'Flight Surgeon Note'
      },
      ...clinicalNotes
    ])
    setNewNote('')
  }

  const handleExportPdf = () => {
    const success = exportService.exportAstronautPdf(currentAstro, currentVitals, alerts)
    if (success) {
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    }
  }

  const handleExportCsv = () => {
    exportService.exportTelemetryCsv(currentAstro)
  }

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-lime-500" />
            <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              CLINICAL MEDICAL LOG & EXPORT CONSOLE
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Subject: {currentAstro.name} • Official NASA Flight Surgeon Clinical History & Multi-Format Data Dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="min-h-[44px] flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-space-700 transition-colors"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all"
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Printer className="w-4 h-4 shrink-0" />}
            <span>{downloadSuccess ? 'PDF Generated!' : 'Generate Official PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="mission-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-200 dark:border-space-700 shrink-0">
            {currentAstro.avatar}
          </span>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {currentAstro.name} ({currentAstro.role})
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {currentAstro.id} • Age: {currentAstro.age} • Blood: {currentAstro.bloodType} • Height: {currentAstro.heightCm} cm • Weight: {currentAstro.weightKg} kg
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Mission Status</span>
            <p className="font-bold text-emerald-500">FIT FOR FLIGHT</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Cumulative MET</span>
            <p className="mono-data font-bold text-gray-900 dark:text-white">Day {currentAstro.missionDay} of 280</p>
          </div>
        </div>
      </div>

      {/* Add Clinical Note Form */}
      <div className="mission-card">
        <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
          APPEND FLIGHT SURGEON MEDICAL ENTRY
        </h3>
        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            rows={3}
            required
            placeholder="Document clinical observations, diagnostic findings, or prescribed protocol adjustments..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-space-700 bg-gray-50 dark:bg-space-800 text-gray-900 dark:text-white text-xs sm:text-sm"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-nasa-blue hover:bg-blue-700 text-white shadow transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Record Clinical Note</span>
            </button>
          </div>
        </form>
      </div>

      {/* Historical Medical Log Timeline */}
      <div className="mission-card">
        <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-4">
          LONGITUDINAL CLINICAL EVENT & EXAMINATION TIMELINE
        </h3>

        <div className="space-y-3">
          {clinicalNotes.map((note) => (
            <div
              key={note.id}
              className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-100 dark:border-space-700 text-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-nasa-blue/10 dark:bg-nasa-blueLight/20 text-nasa-blue dark:text-nasa-blueLight">
                    {note.tag}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{note.author}</span>
                </div>
                <span className="mono-data text-[10px] text-gray-400">{note.date}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
                {note.entry}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Source Footer */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-space-700 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>Source: NASA Flight Medicine Clinic Protocols & Space Medicine Operations Division</span>
        <a
          href="https://www.nasa.gov/johnson/health-and-medical"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nasa-blue dark:text-nasa-blueLight hover:underline flex items-center gap-1"
        >
          NASA Johnson Space Center Medical Ops <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
