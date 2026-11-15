// Generate realistic ECG-like waveform data points
export function generateECGData(numPoints = 200) {
  const data = []
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints
    const cycle = t * 4 * Math.PI
    // Simulate P wave, QRS complex, T wave
    let value = 0
    const phase = cycle % (2 * Math.PI)
    if (phase > 0.8 && phase < 1.2) {
      value = 0.25 * Math.sin((phase - 0.8) * Math.PI / 0.4) // P wave
    } else if (phase > 1.4 && phase < 1.55) {
      value = -0.15 // Q
    } else if (phase > 1.55 && phase < 1.7) {
      value = 1.0 * Math.sin((phase - 1.55) * Math.PI / 0.15) // R
    } else if (phase > 1.7 && phase < 1.85) {
      value = -0.3 // S
    } else if (phase > 2.2 && phase < 2.8) {
      value = 0.35 * Math.sin((phase - 2.2) * Math.PI / 0.6) // T wave
    }
    value += (Math.random() - 0.5) * 0.03 // noise
    data.push({ time: i, value: parseFloat(value.toFixed(3)) })
  }
  return data
}

// Vitals data for each crew member
export const vitalsConfig = {
  'cmd-01': {
    heartRate: { current: 72, min: 58, max: 95, unit: 'bpm', status: 'nominal' },
    bloodPressure: { systolic: 118, diastolic: 76, unit: 'mmHg', status: 'nominal' },
    spO2: { current: 98.2, unit: '%', status: 'nominal' },
    temperature: { current: 36.7, unit: '°C', status: 'nominal' },
    respiratoryRate: { current: 16, unit: 'br/min', status: 'nominal' },
    hrv: { current: 45, unit: 'ms', status: 'nominal' },
  },
  'plt-02': {
    heartRate: { current: 68, min: 55, max: 88, unit: 'bpm', status: 'nominal' },
    bloodPressure: { systolic: 122, diastolic: 80, unit: 'mmHg', status: 'nominal' },
    spO2: { current: 97.8, unit: '%', status: 'nominal' },
    temperature: { current: 36.5, unit: '°C', status: 'nominal' },
    respiratoryRate: { current: 14, unit: 'br/min', status: 'nominal' },
    hrv: { current: 52, unit: 'ms', status: 'nominal' },
  },
  'eng-03': {
    heartRate: { current: 88, min: 62, max: 110, unit: 'bpm', status: 'warning' },
    bloodPressure: { systolic: 132, diastolic: 88, unit: 'mmHg', status: 'warning' },
    spO2: { current: 96.1, unit: '%', status: 'warning' },
    temperature: { current: 37.4, unit: '°C', status: 'warning' },
    respiratoryRate: { current: 20, unit: 'br/min', status: 'warning' },
    hrv: { current: 28, unit: 'ms', status: 'warning' },
  },
  'sci-04': {
    heartRate: { current: 75, min: 60, max: 92, unit: 'bpm', status: 'nominal' },
    bloodPressure: { systolic: 120, diastolic: 78, unit: 'mmHg', status: 'nominal' },
    spO2: { current: 98.5, unit: '%', status: 'nominal' },
    temperature: { current: 36.6, unit: '°C', status: 'nominal' },
    respiratoryRate: { current: 15, unit: 'br/min', status: 'nominal' },
    hrv: { current: 48, unit: 'ms', status: 'nominal' },
  },
}

// Generate heart rate trend data (24 hours)
export function generateHRTrend(baseHR = 72) {
  const data = []
  for (let i = 0; i < 24; i++) {
    const hour = `${String(i).padStart(2, '0')}:00`
    // Simulate circadian rhythm
    const circadian = i >= 6 && i <= 22
      ? baseHR + Math.sin((i - 6) / 16 * Math.PI) * 15
      : baseHR - 10 + Math.random() * 5
    data.push({
      time: hour,
      hr: Math.round(circadian + (Math.random() - 0.5) * 8),
      hrMin: Math.round(circadian - 10 + Math.random() * 3),
      hrMax: Math.round(circadian + 10 + Math.random() * 5),
    })
  }
  return data
}

// Generate SpO2 trend
export function generateSpO2Trend(baseSpO2 = 98) {
  const data = []
  for (let i = 0; i < 24; i++) {
    const hour = `${String(i).padStart(2, '0')}:00`
    data.push({
      time: hour,
      spo2: parseFloat((baseSpO2 + (Math.random() - 0.5) * 2).toFixed(1)),
    })
  }
  return data
}

// Generate blood pressure trend
export function generateBPTrend(baseSys = 118, baseDia = 76) {
  const data = []
  for (let i = 0; i < 24; i++) {
    const hour = `${String(i).padStart(2, '0')}:00`
    data.push({
      time: hour,
      systolic: Math.round(baseSys + (Math.random() - 0.5) * 12),
      diastolic: Math.round(baseDia + (Math.random() - 0.5) * 8),
    })
  }
  return data
}
