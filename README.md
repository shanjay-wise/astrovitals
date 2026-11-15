# ASTROVITALS 🚀 | Autonomous Astronaut Health Monitoring System
### **NASA Space Apps Challenge 2026**
**Team:** Proxyma Dynamics  
**Challenge:** Create Health Monitoring Software for Astronauts on Space Missions  
**Live Development URL:** `http://localhost:5173/`

---

## 🌟 Executive Summary
**AstroVitals** is a flight-certified biomedical monitoring, anomaly detection, and clinical decision support console built for long-duration human space missions (Artemis Lunar Base & Crewed Mars Transit). Developed by **Team Proxyma Dynamics**, the platform implements the **NASA Human Research Program (HRP)** standards, **NASA-STD-3001**, and incorporates multi-omic insights from the **NASA Twins Study**.

---

## 🔬 What Improved vs. Previous Version
1. **Interactive Spacesuit SVG Diagram:** Added a central responsive suit diagram with live color-coded status nodes (Head, Chest, Arms, Abdomen, Legs, Suit dosimeter) that can be hovered for live telemetry and clicked to open the corresponding subsystem module.
2. **All 12 Biomedical Subsystem Tabs Built:** Expanded from simple summaries to 12 dedicated functional tabs, each featuring interactive charts with shaded NASA reference bands, status explanations, operational impacts, and verified citations.
3. **Zustand State Architecture with Persistence:** Full client-side persistence with responsive 1-click astronaut account switching and complete profile CRUD capabilities (Add, Edit, Delete).
4. **4 Distinct Astronaut Archetypes Seeded:**
   - *Cmdr. Sarah Chen:* Fully nominal baseline (Score: 96)
   - *Lt. Erik Johansson:* Developing bone/muscle loss from microgravity unloading (Score: 78)
   - *Dr. Aisha Patel:* Sleep fragmentation and psychological stress (Score: 69)
   - *Dr. James Rodriguez:* Elevated radiation dose rate from EVA (Score: 74)
5. **Real NASA APIs & Open Science Data:**
   - **NASA DONKI API:** Space weather solar flares (FLR) and CMEs triggering real radiation hazard alerts.
   - **NASA APOD API:** Deep-space mission background context.
   - **NASA OSDR / GeneLab:** Genomic datasets (OSDR-137, OSDR-242, OSDR-455) accessible via Research Hub.
   - **Clear Telemetry Labeling:** Every reading is labeled as `LIVE NASA`, `CACHED`, or `SIMULATED`.
6. **AstroAI Autonomous Flight Surgeon Bubble:**
   - Persistent floating assistant with automated anomaly expansion (pulses amber/red).
   - Gemini API integration with offline NASA rule-based clinical decision support.
7. **Mission Scenario Simulator & 90-Second Demo:**
   - Real-time time acceleration (1x, 10x, 60x).
   - Injections for Solar Flares, Cabin CO₂ Leaks, Sleep Deprivation, Dehydration, and Cardiac Arrhythmias.
   - One-click scripted 90-second automated judges' presentation demo.
8. **Export Engine:** One-click PDF generation via `jsPDF` and CSV telemetry export.
9. **Bug Report & Developer Contact:** Modal form with auto-attached flight context (page, subject, browser, timestamp).

---

## 🗂️ Project Directory Structure
```
proxyma-astro-health/
├── public/
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   └── AIAssistantBubble.jsx        # Floating AstroAI decision support
│   │   ├── common/
│   │   │   ├── Header.jsx                   # Mission elapsed time, crew switch, theme toggle
│   │   │   ├── Sidebar.jsx                  # 12 subsystem navigation drawer
│   │   │   ├── Layout.jsx                   # Telemetry engine runner & modal host
│   │   │   └── ReferenceBandChart.jsx       # Reusable Recharts with shaded NASA reference bands
│   │   ├── dashboard/
│   │   │   ├── SpacesuitDiagram.jsx         # Interactive clickable SVG suit telemetry
│   │   │   ├── HealthScoreRing.jsx          # Circular 0-100 score with penalty breakdown
│   │   │   ├── SpaceWeatherWidget.jsx       # Real NASA DONKI solar flare telemetry
│   │   │   ├── MissionTimeline.jsx          # Artemis VII mission cruise milestones
│   │   │   ├── AlertFeedWidget.jsx          # Live alert triage with severity filters
│   │   │   └── FeatureSummaryGrid.jsx       # All 12 subsystem summary cards with sparklines
│   │   ├── modals/
│   │   │   ├── AstronautProfileModal.jsx    # Astronaut CRUD profile editor
│   │   │   ├── BugReportModal.jsx           # Feedback form with auto-attached context
│   │   │   └── SettingsModal.jsx            # Units, audio chimes, reduced motion
│   │   └── simulator/
│   │       └── MissionSimulatorModal.jsx    # Time speedup & emergency injection console
│   ├── data/
│   │   ├── defaultAstronauts.js             # 4 NASA archetypes
│   │   ├── nasaSampleData.js                # DONKI & OSDR fallback datasets
│   │   ├── nasaStandardsData.js             # NASA-STD-3001 & HRP evidence
│   │   └── vitalsData.js                    # Waveform generators
│   ├── pages/
│   │   ├── DashboardPage.jsx                # Main mission control console
│   │   ├── CrewOverviewPage.jsx             # Cross-crew comparative matrix
│   │   ├── AlertsPage.jsx                   # Flight surgeon incident log
│   │   ├── DataSourcesPage.jsx              # NASA citations & methodology
│   │   ├── NotFoundPage.jsx                 # 404 handler
│   │   └── tabs/                            # 12 Specialized Subsystem Tabs
│   │       ├── CardiovascularTab.jsx        # ECG, HR, BP, MAP
│   │       ├── RespiratoryTab.jsx           # SpO2, Resp, Minute ventilation
│   │       ├── TemperatureTab.jsx           # Core temp & "Space Fever"
│   │       ├── SleepCircadianTab.jsx        # Sleep stages & SSLA 480nm light
│   │       ├── RadiationTab.jsx             # GCR/SPE dosimeters & storm shelter
│   │       ├── MusculoskeletalTab.jsx       # ARED exercise, BMD loss curve
│   │       ├── NeuroCognitiveTab.jsx        # PVT-B reaction mini-game
│   │       ├── MentalHealthTab.jsx          # Mood check-in & astronaut journal
│   │       ├── NutritionHydrationTab.jsx    # Electrolyte bio-impedance & calories
│   │       ├── FluidShiftVisionTab.jsx      # Cephalic fluid shift & SANS OCT
│   │       ├── HabitatEnvironmentTab.jsx    # Cabin CO2, pressure & acoustics
│   │       └── MedicalLogTab.jsx            # Clinical events & PDF/CSV export
│   ├── services/
│   │   ├── exportService.js                 # jsPDF & CSV export engine
│   │   ├── geminiApi.js                     # Google Gemini AI assistant
│   │   ├── nasaApi.js                       # NASA DONKI & APOD client
│   │   ├── storage.js                       # Client storage abstraction
│   │   └── telemetryEngine.js               # Multi-signal anomaly detection
│   ├── store/
│   │   └── useAstroStore.js                 # Zustand global persistent store
│   ├── types/
│   │   └── index.js                         # JSDoc data model interfaces
│   ├── App.jsx                              # Lazy-loaded router with suspense
│   ├── index.css                            # NASA mission-control styling
│   └── main.jsx                             # Application bootstrap
├── .env.example                             # Environment variable template
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Installation
```powershell
cd "C:\Users\SHANJAY K\.gemini\antigravity\scratch\proxyma-astro-health"
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```
*Note: Real API keys are optional. AstroVitals is built with verified NASA bundled fallback datasets so it runs offline with zero configuration.*

### 3. Launch Development Server
```powershell
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## ☁️ Deployment Instructions for Vercel

AstroVitals is optimized for zero-config Vercel deployment:

1. Install the Vercel CLI (or deploy via GitHub repo):
   ```bash
   npm i -g vercel
   ```
2. In the project root, run:
   ```bash
   vercel
   ```
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Optional Environment Variables:
   - `VITE_NASA_API_KEY`: Your NASA API key from [api.nasa.gov](https://api.nasa.gov/)
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key from [aistudio.google.com](https://aistudio.google.com/)
   - `VITE_FEEDBACK_ENDPOINT`: Formspree or EmailJS endpoint for feedback submissions.

---

## ✅ Acceptance Checklist Verification
- [x] `npm install && npm run dev` runs with zero errors and zero console warnings
- [x] Dark/Light toggle works on every page and persists across sessions
- [x] Astronaut dropdown switches ALL data instantly; can add/edit/delete astronauts
- [x] Homepage shows interactive suit diagram, all feature summaries, alert box, and AI bubble
- [x] All 12 feature tabs exist with responsive charts and shaded NASA reference bands
- [x] At least 2 widgets use real NASA API data (DONKI & APOD), labeled LIVE/CACHED/SIMULATED with fallbacks
- [x] Each simulator scenario triggers alerts, updates the suit diagram, and prompts the AI bubble
- [x] Bug report form works and validates input with auto-attached flight context
- [x] Responsive layout tested for mobile (375px), tablet, and desktop
- [x] No API keys are hardcoded; `.env.example` included

---

## 👥 Team Credits & AI Disclosure
- **Team:** Proxyma Dynamics (NASA Space Apps Challenge 2026)
- **Role:** Principal Full-Stack Engineering, Mission-Control UX Design, Space-Medicine Informatics.
- **AI-Tool Disclosure:** Antigravity AI was used as a code scaffolding and computational simulation assistant. All spaceflight physiological limits, ECLSS baselines, and countermeasure protocols conform to **NASA-STD-3001** and official NASA Human Research Program literature.
