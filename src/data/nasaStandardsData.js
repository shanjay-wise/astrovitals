// NASA Standards, Biomedical Baselines, and Human Research Program (HRP) Data
// Sources: NASA-STD-3001 Vol 1 & 2, NASA Human Research Roadmap, NASA Twins Study, ISS ECLSS Specs

export const nasaStandards = {
  vitals: {
    heartRate: {
      restingNominal: { min: 55, max: 85, unit: 'bpm' },
      evaLimit: { max: 145, unit: 'bpm' },
      deconditioningThreshold: 90,
      description: 'Microgravity reduces cardiovascular workload by eliminating hydrostatic blood pressure gradients. Elevated resting HR indicates cardiovascular deconditioning or fluid shift compensation.'
    },
    bloodPressure: {
      nominalSystolic: { min: 95, max: 130, unit: 'mmHg' },
      nominalDiastolic: { min: 60, max: 85, unit: 'mmHg' },
      orthostaticRiskCutoff: 90, // systolic drop upon standing / gravity re-entry
      description: 'Cephalic fluid shift of approx 1.5 - 2.0 L towards head causes acute baroreceptor resetting, followed by hypovolemia and orthostatic intolerance upon re-entry.'
    },
    spO2: {
      minimumPermissible: 95.0, // NASA-STD-3001 cabin target
      optimal: 98.0,
      unit: '%',
      description: 'Maintained via cabin oxygen partial pressure (ppO2) of 145-160 mmHg (19.5 - 21.3% at 14.7 psi).'
    },
    coreTemperature: {
      nominal: { min: 36.4, max: 37.2, unit: '°C' },
      spaceflightFeverOffset: 1.0, // Long-duration spaceflight causes persistent +1°C resting core temp elevation due to impaired convection and sweat evaporation
      description: 'Known as "Space Fever", astronauts exhibit increased core temp even at rest in microgravity due to altered thermo-regulation and persistent IL-6 inflammatory response.'
    },
    hrv: {
      rmssdTarget: { min: 35, max: 85, unit: 'ms' },
      autonomicStressAlert: 30,
      description: 'Heart Rate Variability (RMSSD) reflects autonomic nervous system balance; vagal tone reduction signals chronic spaceflight physiological stress and sleep fragmentation.'
    }
  },

  eclss: {
    ppCO2: {
      nasaStd3001Max: 3.0, // mmHg (lower is strictly enforced to prevent headache & cognitive decrement)
      nominalTarget: 2.0,
      currentStationAverage: 2.3,
      unit: 'mmHg',
      description: 'Carbon dioxide partial pressure. High CO2 levels (>3 mmHg) exacerbate SANS (Spaceflight Associated Neuro-ocular Syndrome) and cause astronaut headaches.'
    },
    ppO2: {
      nominal: 155.0, // mmHg
      range: { min: 140, max: 170 },
      unit: 'mmHg',
    },
    cabinPressure: {
      nominal: 14.7, // psia (101.3 kPa)
      unit: 'psi',
    },
    waterRecoveryRate: {
      target: 98.0, // Exploration target for Mars transit (ISS currently reaches ~93-94%)
      currentISS: 93.5,
      unit: '%',
    },
    oxygenRecoveryRate: {
      target: 75.0, // Via Sabatier Reactor + Plasma Pyrolysis Assembly
      unit: '%',
    }
  },

  radiation: {
    careerLimitMsv: 600, // NASA modernized age/sex-neutral career permissible limit based on 3% REID
    annualLimitMsv: 200,
    dailyTransitMsv: 1.3, // Typical deep space / interplanetary GCR dose rate without storm
    dailyLEOMsv: 0.5, // Low Earth Orbit with Earth magnetosphere shielding
    speAlertThreshold: 2.5, // mSv/hr trigger for Safe Haven retreat
    description: 'Radiation is characterized by Galactic Cosmic Rays (GCR - high-Z high-energy ions) and Solar Particle Events (SPE - high-flux protons). ALARA (As Low As Reasonably Achievable) protocol active.'
  },

  hrpFiveHazards: [
    {
      id: 'hazard-radiation',
      code: 'R',
      name: 'Space Radiation',
      severity: 'Critical',
      icon: 'Radioactive',
      summary: 'GCRs and SPEs penetrate spacecraft hulls, damaging cellular DNA, increasing lifetime cancer risk, and threatening CNS and cardiovascular function.',
      countermeasures: ['Hydrogen-rich polyethylene shielding', 'Water-wall storm shelter', 'Active radioprotective antioxidants', 'Tissue Equivalent Proportional Counter (TEPC) dosimetry'],
      keyMetric: 'Cumulative Sieverts (mSv) & 3% REID Threshold'
    },
    {
      id: 'hazard-isolation',
      code: 'I',
      name: 'Isolation & Confinement',
      severity: 'High',
      icon: 'Brain',
      summary: 'Extended stays in confined volume with identical small crew leads to sleep loss, circadian desynchronization, mood drift, and cognitive slowing.',
      countermeasures: ['NASA Psychomotor Vigilance Task (PVT-B)', 'Dynamic blue-enriched spectrum LED lighting', 'VR sensory stimulation', 'Scheduled synchronous family/ground comms'],
      keyMetric: 'PVT Response Speed & REM Sleep Fraction'
    },
    {
      id: 'hazard-distance',
      code: 'D',
      name: 'Distance from Earth',
      severity: 'High',
      icon: 'MilkyWay',
      summary: 'Deep space missions (Lunar/Mars) face comms delay up to 22 minutes one-way; evacuation or real-time telemedicine from Earth is physically impossible.',
      countermeasures: ['Autonomous Medical Operations (AMO)', 'Onboard AI diagnostics & decision support', 'Sterile medical consumable re-synthesis', 'Clinical ultrasound & automated CPR systems'],
      keyMetric: 'Medical Autonomy Level (Class IV / V)'
    },
    {
      id: 'hazard-gravity',
      code: 'G',
      name: 'Gravity Transitions',
      severity: 'Critical',
      icon: 'Compass',
      summary: 'Transitions from 1g -> 0g -> 0.16g (Moon) -> 0.38g (Mars) induce muscle atrophy (up to 20% in 2 weeks), bone mineral density loss (1-1.5%/month), and SANS.',
      countermeasures: ['Advanced Resistive Exercise Device (ARED) 2.5 hr/day', 'Treadmill with harness vibration isolation', 'Lower Body Negative Pressure (LBNP)', 'Bisphosphonate bone protective therapy'],
      keyMetric: 'Dual-energy X-ray Absorptiometry (DXA) T-Score'
    },
    {
      id: 'hazard-environment',
      code: 'E',
      name: 'Hostile Closed Environments',
      severity: 'High',
      icon: 'Atom',
      summary: 'Closed ecosystem cabin atmosphere accumulates toxic trace volatile organics, microbial biofilms, and high acoustic noise; ECLSS failure is immediately life-threatening.',
      countermeasures: ['Catalytic trace contaminant oxidizers', 'Silver-biocide water filtration', 'Acoustic baffling (<52 dBA sleep stations)', 'HEPA and ultra-fine dust scrubbers'],
      keyMetric: 'Cabin ppCO2 (<3 mmHg) & Microbial CFU/m³'
    }
  ],

  nasaTwinsStudyFindings: [
    {
      parameter: 'Telomere Length',
      finding: 'Telomeres lengthened significantly during spaceflight, followed by rapid shortening within 48 hours post-landing.',
      impact: 'Indicates cellular genomic stress response and accelerated aging kinetics upon re-entry.'
    },
    {
      parameter: 'Carotid Artery Intima-Media',
      finding: 'Significant arterial wall thickening and stiffness observed throughout flight.',
      impact: 'Spaceflight-induced cardiovascular remodeling mimicking advanced atherosclerosis.'
    },
    {
      parameter: 'Cognitive Performance',
      finding: 'Cognitive accuracy remained stable, but cognitive speed decreased noticeably post-flight.',
      impact: 'Confirms crew operational fidelity requires autonomous workload throttling.'
    },
    {
      parameter: 'Gene Expression (Transcriptomics)',
      finding: '91.3% of gene expression changes normalized post-flight; ~8.7% displayed persistent alterations (immune, DNA repair).',
      impact: 'Emphasizes requirement for continuous genomic and bio-marker tracking.'
    }
  ]
}
