export const supplyConfig = {
  oxygen: {
    name: 'Oxygen Supply',
    icon: '💨',
    current: 82,
    unit: '%',
    dailyConsumption: 0.55,
    daysRemaining: 149,
    status: 'nominal',
    capacity: '2400 L',
    refillDate: 'Day 210',
  },
  water: {
    name: 'Water Supply',
    icon: '💧',
    current: 71,
    unit: '%',
    dailyConsumption: 0.65,
    daysRemaining: 109,
    status: 'nominal',
    capacity: '800 L',
    refillDate: 'Day 210',
    recycleRate: 93,
  },
  food: {
    name: 'Food Rations',
    icon: '🍱',
    current: 68,
    unit: '%',
    dailyConsumption: 0.48,
    daysRemaining: 141,
    status: 'nominal',
    capacity: '2800 meals',
    categories: {
      protein: 72,
      carbs: 65,
      vitamins: 58,
      supplements: 81,
    },
  },
  medical: {
    name: 'Medical Supplies',
    icon: '💊',
    current: 88,
    unit: '%',
    status: 'nominal',
    categories: {
      medications: { level: 90, items: 145 },
      firstAid: { level: 85, items: 80 },
      surgical: { level: 92, items: 35 },
      diagnostic: { level: 78, items: 22 },
    },
  },
  power: {
    name: 'Power Systems',
    icon: '⚡',
    current: 94,
    unit: '%',
    status: 'nominal',
    solarOutput: 98,
    batteryLevel: 91,
    consumption: 4.2,
    capacityKW: 12.5,
  },
}

export function generateConsumptionTrend(resource = 'oxygen') {
  const data = []
  let level = 100
  const rates = { oxygen: 0.55, water: 0.65, food: 0.48 }
  const rate = rates[resource] || 0.55
  for (let i = 0; i < 180; i++) {
    const day = i + 1
    level = Math.max(0, level - rate - (Math.random() - 0.5) * 0.1)
    data.push({
      day: `Day ${day}`,
      level: parseFloat(level.toFixed(1)),
      projected: parseFloat((100 - rate * day).toFixed(1)),
    })
  }
  return data
}

export function generateSupplyForecast() {
  const data = []
  for (let i = 0; i < 30; i++) {
    const day = 147 + i
    data.push({
      day: `Day ${day}`,
      oxygen: parseFloat((82 - 0.55 * i).toFixed(1)),
      water: parseFloat((71 - 0.65 * i).toFixed(1)),
      food: parseFloat((68 - 0.48 * i).toFixed(1)),
    })
  }
  return data
}
