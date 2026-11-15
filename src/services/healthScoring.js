/**
 * NASA-STD-3001 Unified Health Scoring & Status Engine
 *
 * Single Source of Truth for:
 * 1. Health Score (0 - 100)
 * 2. Status Level ('nominal' | 'caution' | 'critical')
 * 3. Status Display Label ('OPTIMAL' | 'ATTENTION' | 'CRITICAL')
 * 4. Active Score Variance Factors (deductions list)
 * 5. Subsystem Channel Statuses (hr, spo2, resp, bp, temp, radiation, co2, hydration, bone, muscle, stress, sleep)
 */

export function computeHealthStatus(astronaut, vitals = null, alerts = []) {
  if (!astronaut) {
    return {
      score: 100,
      status: 'nominal',
      statusLabel: 'OPTIMAL',
      deductions: [],
      statuses: {
        hr: 'nominal',
        spo2: 'nominal',
        resp: 'nominal',
        bp: 'nominal',
        temp: 'nominal',
        radiation: 'nominal',
        co2: 'nominal',
        hydration: 'nominal',
        bone: 'nominal',
        muscle: 'nominal',
        stress: 'nominal',
        sleep: 'nominal'
      },
      activeAlerts: []
    }
  }

  const baselines = astronaut.baselines || {}

  // Filter unacknowledged active alerts that apply to this astronaut
  const unacknowledgedAlerts = (alerts || []).filter(a => {
    if (a.acknowledged) return false
    const matchesId = a.astronautId === astronaut.id || a.crewId === astronaut.id
    const matchesName = a.crewName && (a.crewName === astronaut.name || a.crewName === 'All Crew')
    const isGlobal = !a.astronautId && !a.crewId
    return matchesId || matchesName || isGlobal
  })

  // Check if an unacknowledged critical radiation alert is targeted at this astronaut
  const hasActiveRadiationAlert = unacknowledgedAlerts.some(a =>
    a.severity === 'critical' &&
    ((a.metric || '').toLowerCase().includes('radiation') ||
     (a.title || '').toLowerCase().includes('radiation') ||
     (a.type || '') === 'radiation')
  )

  // Resolve current vital metrics (preferring live vitals, then baselines)
  const defaultRadiation = hasActiveRadiationAlert
    ? 2.65
    : (astronaut.archetype === 'radiation_alert' && hasActiveRadiationAlert ? 2.65 : 0.042)

  const v = {
    hr: vitals?.hr ?? baselines.hr ?? 70,
    hrv: vitals?.hrv ?? baselines.hrv ?? 50,
    bpSys: vitals?.bpSys ?? baselines.bpSys ?? 120,
    bpDia: vitals?.bpDia ?? baselines.bpDia ?? 80,
    spo2: vitals?.spo2 ?? baselines.spo2 ?? 98.0,
    resp: vitals?.resp ?? baselines.resp ?? 15,
    coreTemp: vitals?.coreTemp ?? baselines.coreTemp ?? 36.7,
    radiationRate: vitals?.radiationRate ?? defaultRadiation,
    cabinCO2: vitals?.cabinCO2 ?? 2.1,
    hydration: vitals?.hydration ?? baselines.hydration ?? 95,
    boneDensity: vitals?.boneDensity ?? baselines.boneDensity ?? 100,
    muscleMass: vitals?.muscleMass ?? baselines.muscleMass ?? 100,
    stressIndex: vitals?.stressIndex ?? (astronaut.archetype === 'sleep_stress' ? 68 : 28),
    sleepHrs: vitals?.sleepHrs ?? baselines.sleepHrs ?? 7.5
  }

  // NASA-STD-3001 threshold evaluations
  const statuses = {
    hr: (v.hr > 105 || v.hr < 45) ? 'critical' : (v.hr > 90 || v.hr < 52) ? 'caution' : 'nominal',
    spo2: v.spo2 < 93.0 ? 'critical' : v.spo2 < 95.0 ? 'caution' : 'nominal',
    resp: (v.resp > 22 || v.resp < 10) ? 'critical' : (v.resp > 18 || v.resp < 12) ? 'caution' : 'nominal',
    bp: (v.bpSys > 140 || v.bpSys < 90 || v.bpDia > 90) ? 'critical' : (v.bpSys > 130 || v.bpSys < 95 || v.bpDia > 85) ? 'caution' : 'nominal',
    temp: (v.coreTemp > 38.0 || v.coreTemp < 35.5) ? 'critical' : (v.coreTemp > 37.5 || v.coreTemp < 36.0) ? 'caution' : 'nominal',
    radiation: v.radiationRate >= 2.5 ? 'critical' : v.radiationRate > 0.15 ? 'caution' : 'nominal',
    co2: v.cabinCO2 > 3.5 ? 'critical' : v.cabinCO2 > 3.0 ? 'caution' : 'nominal',
    hydration: v.hydration < 80 ? 'critical' : v.hydration < 88 ? 'caution' : 'nominal',
    bone: v.boneDensity < 90 ? 'critical' : v.boneDensity < 94 ? 'caution' : 'nominal',
    muscle: v.muscleMass < 88 ? 'critical' : v.muscleMass < 92 ? 'caution' : 'nominal',
    stress: v.stressIndex > 75 ? 'critical' : v.stressIndex > 55 ? 'caution' : 'nominal',
    sleep: v.sleepHrs < 5.0 ? 'critical' : v.sleepHrs < 6.5 ? 'caution' : 'nominal'
  }

  const deductions = []
  let totalPenalty = 0

  // 1. Channel deductions
  if (statuses.hr === 'critical') {
    deductions.push(`Critical Tachycardia / Arrhythmia (${v.hr} bpm) (-20 pts)`)
    totalPenalty += 20
  } else if (statuses.hr === 'caution') {
    deductions.push(`Elevated resting pulse (${v.hr} bpm) (-8 pts)`)
    totalPenalty += 8
  }

  if (statuses.spo2 === 'critical') {
    deductions.push(`Hypoxia / Low SpO₂ (${v.spo2}%) (-25 pts)`)
    totalPenalty += 25
  } else if (statuses.spo2 === 'caution') {
    deductions.push(`Sub-optimal SpO₂ (${v.spo2}%) (-10 pts)`)
    totalPenalty += 10
  }

  if (statuses.bp === 'critical') {
    deductions.push(`Blood pressure instability (${v.bpSys}/${v.bpDia} mmHg) (-15 pts)`)
    totalPenalty += 15
  } else if (statuses.bp === 'caution') {
    deductions.push(`Borderline blood pressure (${v.bpSys}/${v.bpDia} mmHg) (-8 pts)`)
    totalPenalty += 8
  }

  if (statuses.temp === 'critical') {
    deductions.push(`Thermal dysregulation / Space Fever (${v.coreTemp}°C) (-15 pts)`)
    totalPenalty += 15
  } else if (statuses.temp === 'caution') {
    deductions.push(`Mild thermal elevation (${v.coreTemp}°C) (-6 pts)`)
    totalPenalty += 6
  }

  if (statuses.radiation === 'critical') {
    deductions.push(`Solar Particle Event radiation spike (${v.radiationRate} mSv/hr) (-25 pts)`)
    totalPenalty += 25
  } else if (statuses.radiation === 'caution') {
    deductions.push(`Elevated radiation exposure rate (${v.radiationRate} mSv/hr) (-12 pts)`)
    totalPenalty += 12
  }

  if (statuses.co2 === 'critical') {
    deductions.push(`Cabin CO₂ hypercapnia risk (${v.cabinCO2} mmHg) (-20 pts)`)
    totalPenalty += 20
  } else if (statuses.co2 === 'caution') {
    deductions.push(`Elevated cabin CO₂ (${v.cabinCO2} mmHg) (-8 pts)`)
    totalPenalty += 8
  }

  if (statuses.stress === 'critical') {
    deductions.push(`High psychological stress index (${v.stressIndex}/100) (-12 pts)`)
    totalPenalty += 12
  } else if (statuses.stress === 'caution') {
    deductions.push(`Moderate psychological stress (${v.stressIndex}/100) (-6 pts)`)
    totalPenalty += 6
  }

  if (statuses.hydration === 'critical') {
    deductions.push(`Severe hypovolemic dehydration (${Math.round(v.hydration)}%) (-15 pts)`)
    totalPenalty += 15
  } else if (statuses.hydration === 'caution') {
    deductions.push(`Mild dehydration (${Math.round(v.hydration)}%) (-8 pts)`)
    totalPenalty += 8
  }

  if (statuses.bone === 'critical') {
    deductions.push(`Critical bone mineral density loss (${v.boneDensity}%) (-15 pts)`)
    totalPenalty += 15
  } else if (statuses.bone === 'caution') {
    deductions.push(`Bone mineral density loss (${v.boneDensity}%) (-10 pts)`)
    totalPenalty += 10
  }

  if (statuses.muscle === 'critical') {
    deductions.push(`Severe skeletal muscle atrophy (${v.muscleMass}%) (-14 pts)`)
    totalPenalty += 14
  } else if (statuses.muscle === 'caution') {
    deductions.push(`Skeletal muscle volume atrophy (${v.muscleMass}%) (-8 pts)`)
    totalPenalty += 8
  }

  if (statuses.sleep === 'critical') {
    deductions.push(`Acute sleep deprivation (${v.sleepHrs} hrs) (-12 pts)`)
    totalPenalty += 12
  } else if (statuses.sleep === 'caution') {
    deductions.push(`Sub-optimal sleep duration (${v.sleepHrs} hrs) (-6 pts)`)
    totalPenalty += 6
  }

  // 2. Alert deductions
  let hasCriticalAlert = false
  let hasWarningAlert = false

  unacknowledgedAlerts.forEach((alt) => {
    const isCrit = alt.severity === 'critical'
    const isWarn = alt.severity === 'warning' || alt.severity === 'caution'

    if (isCrit) hasCriticalAlert = true
    if (isWarn) hasWarningAlert = true

    const pts = isCrit ? 15 : isWarn ? 8 : 4
    totalPenalty += pts

    const alertLabel = alt.title || alt.metric || alt.message || 'Mission Alert'
    deductions.push(`Active Alert: ${alertLabel} (-${pts} pts)`)
  })

  // Calculate score bounded between 15 and 100
  let score = 100 - totalPenalty
  // Rule: when there are active alerts or variance factors, score must drop below 100
  if ((unacknowledgedAlerts.length > 0 || deductions.length > 0) && score >= 100) {
    score = 95
  }
  score = Math.max(15, Math.min(100, score))

  // Determine single agreed status level
  const anyCriticalVital = Object.values(statuses).some(s => s === 'critical')
  const anyCautionVital = Object.values(statuses).some(s => s === 'caution')

  let status = 'nominal'
  if (hasCriticalAlert || anyCriticalVital || score < 70) {
    status = 'critical'
  } else if (hasWarningAlert || anyCautionVital || score < 85) {
    status = 'caution'
  } else {
    status = 'nominal'
  }

  const statusLabel = status === 'nominal' ? 'OPTIMAL' : status === 'caution' ? 'ATTENTION' : 'CRITICAL'

  return {
    score,
    status,
    statusLabel,
    deductions,
    statuses,
    activeAlerts: unacknowledgedAlerts
  }
}
