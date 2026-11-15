/**
 * Telemetry & Anomaly Engine
 * Generates realistic bio-telemetry with circadian rhythm, exercise spikes, noise,
 * and executes multi-signal anomaly detection against astronaut baseline.
 */

import { nasaStandards } from '../data/nasaStandardsData'
import { computeHealthStatus } from './healthScoring'

export const telemetryEngine = {
  /**
   * Generate a synchronized telemetry snapshot for an astronaut
   * @param {Object} astronaut
   * @param {number} tickCount
   * @param {Object|null} activeScenario
   * @param {Array} currentAlerts
   * @returns {Object} Live metrics snapshot & generated alerts
   */
  generateTick: (astronaut, tickCount = 0, activeScenario = null, currentAlerts = []) => {
    const baselines = astronaut.baselines || {}
    const timeOfDayHours = (12 + (tickCount * 0.05)) % 24 // Circadian simulation

    // Circadian modulation (-5 to +5 bpm)
    const circadianSin = Math.sin((timeOfDayHours - 6) / 24 * 2 * Math.PI)
    const noise = (Math.random() - 0.5) * 1.5

    // Base values
    let hr = Math.round(baselines.hr + circadianSin * 4 + noise * 2)
    let hrv = Math.round(baselines.hrv - circadianSin * 3 + noise * 3)
    let bpSys = Math.round(baselines.bpSys + circadianSin * 3 + noise * 2)
    let bpDia = Math.round(baselines.bpDia + circadianSin * 2 + noise * 1.5)
    let spo2 = parseFloat((baselines.spo2 + (Math.random() - 0.5) * 0.4).toFixed(1))
    let resp = Math.round(baselines.resp + (Math.random() - 0.5) * 1.5)
    let coreTemp = parseFloat((baselines.coreTemp + circadianSin * 0.2 + (Math.random() - 0.5) * 0.08).toFixed(2))

    // Check if astronaut has an active unacknowledged radiation alert
    const hasUnackRadiationAlert = (currentAlerts || []).some(
      a => !a.acknowledged &&
      (a.astronautId === astronaut.id || a.crewId === astronaut.id) &&
      ((a.metric || '').toLowerCase().includes('radiation') || (a.title || '').toLowerCase().includes('radiation') || a.type === 'radiation')
    )

    // For archetype radiation_alert, if they have an active radiation alert or initially, radiation rate is elevated
    let radiationRate = (astronaut.archetype === 'radiation_alert' && hasUnackRadiationAlert) ? 2.65 : 0.042
    let cabinCO2 = 2.1 // mmHg nominal CDRA level
    let hydration = baselines.hydration + (Math.random() - 0.5) * 0.5
    let stressIndex = Math.round(astronaut.archetype === 'sleep_stress' ? 64 : 28 + (Math.random() - 0.5) * 6)
    let cognitiveScore = Math.round(astronaut.archetype === 'sleep_stress' ? 71 : 92 + (Math.random() - 0.5) * 4)
    let boneDensity = baselines.boneDensity
    let muscleMass = baselines.muscleMass
    let sleepScore = Math.round((baselines.sleepHrs / 8.0) * 100)

    // Inject Scenario Influences
    if (activeScenario) {
      switch (activeScenario.type) {
        case 'solar_flare':
          radiationRate = 2.85 // High SPE flux crossing 2.5 mSv/hr threshold!
          stressIndex += 22
          break
        case 'co2_leak':
          cabinCO2 = 3.9 // Exceeds NASA-STD-3001 3.0 mmHg limit!
          spo2 = Math.max(92.1, spo2 - 3.4)
          hr += 18
          resp += 6
          stressIndex += 30
          break
        case 'cardiac_arrhythmia':
          hr = Math.round(118 + Math.random() * 24)
          hrv = Math.max(12, hrv - 25)
          bpSys += 22
          bpDia += 14
          break
        case 'dehydration':
          hydration = 72.4 // Below threshold
          bpSys -= 26 // Orthostatic hypotension drop!
          bpDia -= 16
          hr += 22
          coreTemp += 0.6
          break
        case 'sleep_deprivation':
          sleepScore = 38
          stressIndex = 82
          cognitiveScore = 58
          hrv = Math.max(16, hrv - 22)
          hr += 12
          break
        case 'isolation_stress':
          stressIndex = 88
          cognitiveScore = 64
          hrv = Math.max(14, hrv - 20)
          break
        default:
          break
      }
    }

    // Anomaly Detection: Multi-signal & Threshold Alerts
    const generatedAlerts = []
    const nowIso = new Date().toISOString()

    // Multi-signal rule: High HR + Low SpO2 + High Cabin CO2
    if (hr > 95 && spo2 < 95.0 && cabinCO2 > 3.0) {
      generatedAlerts.push({
        id: `ALT-MULT-${Date.now().toString().slice(-4)}`,
        astronautId: astronaut.id,
        crewId: astronaut.id,
        crewName: astronaut.name,
        timestamp: nowIso,
        severity: 'critical',
        metric: 'Respiratory & Cabin Acidosis',
        title: 'Triple-Signal Acidosis Anomaly',
        message: `Triple-Signal Anomaly: Elevated HR (${hr} bpm) + Low SpO₂ (${spo2}%) during elevated cabin CO₂ (${cabinCO2} mmHg).`,
        recommendation: 'Immediate donning of Quick-Don O₂ mask. Verify CDRA molecular sieve bed cycling.',
        acknowledged: false
      })
    }

    // Solar Radiation Threshold
    if (radiationRate >= 2.5) {
      generatedAlerts.push({
        id: `ALT-RAD-${Date.now().toString().slice(-4)}`,
        astronautId: astronaut.id,
        crewId: astronaut.id,
        crewName: astronaut.name,
        timestamp: nowIso,
        severity: 'critical',
        metric: 'Solar Particle Event Flux',
        title: 'SPE Dosimeter Threshold Exceeded',
        message: `SPE dosimeter rate reached ${radiationRate} mSv/hr exceeding the 2.5 mSv/hr crew safety threshold.`,
        recommendation: 'Initiate immediate retreat into Water-Wall Safe Haven Storm Shelter. Ingest prophylactic antioxidant cocktail.',
        acknowledged: false
      })
    }

    // Cardiac Tachycardia / Arrhythmia Threshold
    if (hr >= 110) {
      generatedAlerts.push({
        id: `ALT-HR-${Date.now().toString().slice(-4)}`,
        astronautId: astronaut.id,
        crewId: astronaut.id,
        crewName: astronaut.name,
        timestamp: nowIso,
        severity: 'warning',
        metric: 'Heart Rate',
        title: 'Tachycardia / Arrhythmia Spike',
        message: `Heart rate spiked to ${hr} bpm, deviating by +${hr - baselines.hr} bpm from resting baseline.`,
        recommendation: 'Throttle scheduled physical EVA / exercise. Conduct 12-lead ECG telemetry review.',
        acknowledged: false
      })
    }

    // SANS / Fluid Shift Orthostatic Alert
    if (bpSys < 95) {
      generatedAlerts.push({
        id: `ALT-BP-${Date.now().toString().slice(-4)}`,
        astronautId: astronaut.id,
        crewId: astronaut.id,
        crewName: astronaut.name,
        timestamp: nowIso,
        severity: 'warning',
        metric: 'Orthostatic Blood Pressure',
        title: 'Orthostatic Hypotension Drop',
        message: `Systolic pressure dropped to ${bpSys} mmHg indicating acute hypovolemic orthostatic intolerance.`,
        recommendation: 'Initiate 1.0 L oral saline rehydration protocol. Don Chibisov Lower Body Negative Pressure (LBNP) suit.',
        acknowledged: false
      })
    }

    const vitals = {
      hr,
      hrv,
      bpSys,
      bpDia,
      spo2,
      resp,
      coreTemp,
      radiationRate,
      cabinCO2,
      hydration: parseFloat(hydration.toFixed(1)),
      stressIndex,
      cognitiveScore,
      boneDensity: parseFloat(boneDensity.toFixed(1)),
      muscleMass: parseFloat(muscleMass.toFixed(1)),
      sleepScore,
      sleepHrs: baselines.sleepHrs
    }

    // All combined alerts for health status calculation
    const allAlerts = [...(currentAlerts || []), ...generatedAlerts]

    // Unified health scoring
    const health = computeHealthStatus(astronaut, vitals, allAlerts)

    return {
      vitals,
      statuses: health.statuses,
      healthScore: health.score,
      healthStatus: health.status,
      healthStatusLabel: health.statusLabel,
      deductions: health.deductions,
      alerts: generatedAlerts
    }
  }
}
