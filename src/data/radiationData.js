export const radiationConfig = {
  'cmd-01': {
    cumulativeDose: { current: 145.2, unit: 'mSv', max: 1000, status: 'nominal' },
    dailyDose: { current: 0.98, unit: 'mSv/day', max: 5, status: 'nominal' },
    solarEventRisk: { level: 'Low', status: 'nominal' },
    shieldingStatus: 'Active',
    doseRate: { current: 0.041, unit: 'mSv/hr' },
  },
  'plt-02': {
    cumulativeDose: { current: 142.8, unit: 'mSv', max: 1000, status: 'nominal' },
    dailyDose: { current: 0.95, unit: 'mSv/day', max: 5, status: 'nominal' },
    solarEventRisk: { level: 'Low', status: 'nominal' },
    shieldingStatus: 'Active',
    doseRate: { current: 0.040, unit: 'mSv/hr' },
  },
  'eng-03': {
    cumulativeDose: { current: 168.5, unit: 'mSv', max: 1000, status: 'warning' },
    dailyDose: { current: 1.15, unit: 'mSv/day', max: 5, status: 'nominal' },
    solarEventRisk: { level: 'Low', status: 'nominal' },
    shieldingStatus: 'Active',
    doseRate: { current: 0.048, unit: 'mSv/hr' },
  },
  'sci-04': {
    cumulativeDose: { current: 138.9, unit: 'mSv', max: 1000, status: 'nominal' },
    dailyDose: { current: 0.92, unit: 'mSv/day', max: 5, status: 'nominal' },
    solarEventRisk: { level: 'Low', status: 'nominal' },
    shieldingStatus: 'Active',
    doseRate: { current: 0.038, unit: 'mSv/hr' },
  },
}

export function generateRadiationTrend(baseDose = 0.98) {
  const data = []
  let cumulative = 0
  for (let i = 0; i < 147; i++) {
    const daily = baseDose + (Math.random() - 0.5) * 0.3
    cumulative += daily
    if (i % 7 === 0) {
      data.push({
        day: `Day ${i + 1}`,
        daily: parseFloat(daily.toFixed(2)),
        cumulative: parseFloat(cumulative.toFixed(1)),
      })
    }
  }
  return data
}

export function generateSolarForecast() {
  const data = []
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
  for (let d = 0; d < 7; d++) {
    for (const hour of hours) {
      data.push({
        time: `Day ${148 + d} ${hour}`,
        flux: parseFloat((2.5 + Math.random() * 1.5).toFixed(2)),
        protonDensity: parseFloat((5 + Math.random() * 3).toFixed(1)),
      })
    }
  }
  return data
}
