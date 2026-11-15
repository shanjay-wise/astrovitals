import React from 'react'
import { Database, ExternalLink, ShieldCheck, BookOpen, Layers, Award, Terminal } from 'lucide-react'
import { osdrGeneLabDatasets } from '../data/nasaSampleData'

export default function DataSourcesPage() {
  const sources = [
    {
      name: 'NASA DONKI (Database of Notifications, Knowledge, Information)',
      endpoint: 'https://ccmc.gsfc.nasa.gov/DONKI/',
      purpose: 'Real-time Solar Flares (FLR), Coronal Mass Ejections (CME), and Solar Energetic Particles (SEP) live telemetry feeding the Radiation tab & automated storm alerts.',
      status: 'Integrated Live with Offline Fallback'
    },
    {
      name: 'NASA APOD (Astronomy Picture of the Day)',
      endpoint: 'https://api.nasa.gov/planetary/apod',
      purpose: 'Mission imagery and cosmic cruise phase backgrounds for flight context and psychological sensory stimulation.',
      status: 'Integrated Live with Cached Fallback'
    },
    {
      name: 'NASA-STD-3001 Technical Standard (Vol 1 & 2)',
      endpoint: 'https://www.nasa.gov/feature/nasa-standard-3001',
      purpose: 'Official human spaceflight permissible exposure limits (PELs), cardiovascular targets (60-85 bpm), cabin ppCO₂ ceilings (<3.0 mmHg), and sleep acoustic thresholds (<52 dBA).',
      status: 'Algorithmically Embedded Reference Bands'
    },
    {
      name: 'NASA Human Research Program (HRP) & Evidence Books',
      endpoint: 'https://www.nasa.gov/hrp',
      purpose: 'The 5 Hazards of Human Spaceflight ("RIDGE") risk transfer functions, countermeasure protocols (ARED 2.5h/day), and SANS clinical practice guidelines.',
      status: 'Scientific Knowledge Base'
    },
    {
      name: 'NASA OSDR (Open Science Data Repository) / GeneLab',
      endpoint: 'https://osdr.nasa.gov',
      purpose: 'Real spaceflight biological omic datasets (OSDR-137 Twins Study, OSDR-242 Immune Remodeling, OSDR-455 DNA Repair Kinetics).',
      status: 'Research Insights Hub'
    },
    {
      name: 'NASA Twins Study (Garrett-Bakelman et al., Science 2019)',
      endpoint: 'https://www.science.org/doi/10.1126/science.aau8650',
      purpose: 'Telomere dynamics, vascular stiffening, cognitive speed vs accuracy, and multi-omic gene expression shifts in long-duration spaceflight.',
      status: 'Genomic Reference Baseline'
    },
    {
      name: 'NASA 3D Resources (Astronaut GLB Model)',
      endpoint: 'https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Astronaut',
      purpose: '3D model: NASA 3D Resources (nasa3d.arc.nasa.gov), original author DigitalSpace Corporation.',
      status: 'Interactive 3D Biotelemetry Spatial Canvas'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-nasa-blue dark:text-nasa-blueLight" />
          <h1 className="heading-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            DATA SOURCES, NASA STANDARDS & METHODOLOGY
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Comprehensive scientific audit of APIs, peer-reviewed clinical data, and NASA technical standards utilized in AstroVitals.
        </p>
      </div>

      {/* Primary Data Sources Table */}
      <div className="mission-card">
        <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white mb-3">
          PRIMARY DATASETS & CLINICAL CITATIONS
        </h3>
        <div className="space-y-3">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-100 dark:border-space-700 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <span className="font-bold text-gray-900 dark:text-white text-sm">{src.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  {src.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed mb-2">
                {src.purpose}
              </p>
              <a
                href={src.endpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] text-nasa-blue dark:text-nasa-blueLight hover:underline font-semibold flex items-center gap-1.5 text-xs break-all"
              >
                <span className="break-all">{src.endpoint}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* NASA OSDR Open Science Data Repository Highlights */}
      <div className="mission-card">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-purple-500" />
          <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white">
            NASA OPEN SCIENCE DATA REPOSITORY (OSDR) / GENELAB DATASETS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {osdrGeneLabDatasets.map((ds, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-gray-50 dark:bg-space-800 border border-gray-100 dark:border-space-700 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="mono-data font-bold text-purple-500">{ds.accession}</span>
                  <span className="text-[10px] text-gray-400">{ds.mission}</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-1.5">{ds.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{ds.keyFinding}</p>
              </div>
              <a
                href={ds.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-nasa-blue dark:text-nasa-blueLight font-semibold hover:underline flex items-center gap-1 mt-2"
              >
                Access OSDR Repo <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Team Proxyma Dynamics Credits & AI Tool Disclosure */}
      <div className="mission-card border-l-4 border-l-nasa-blue">
        <h3 className="heading-display text-sm font-bold text-gray-900 dark:text-white mb-2">
          TEAM PROXYMA DYNAMICS CREDITS & AI-TOOL DISCLOSURE
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          <strong>Team Proxyma Dynamics</strong> developed <strong>AstroVitals</strong> for the <strong>NASA Space Apps Challenge 2026</strong> under the challenge <em>"Create Health Monitoring Software for Astronauts on Space Missions"</em>.
        </p>

        <div className="p-3 rounded-lg bg-blue-50 dark:bg-space-800 border border-blue-100 dark:border-space-700 text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <p><strong>Architecture & Engineering:</strong> React 18, Vite 5, Tailwind CSS, Recharts, Zustand Persistent Store, Lucide Icons.</p>
          <p><strong>AI-Tool Disclosure:</strong> Antigravity AI (Google DeepMind) was used as an engineering assistant for code scaffolding, NASA telemetry mathematical modeling, and SVG diagram formulation. All biomedical parameters conform strictly to NASA-STD-3001 and NASA HRP evidence literature.</p>
        </div>
      </div>
    </div>
  )
}
