export const activityConfig = {
  'cmd-01': {
    dailyExercise: { completed: 2.1, required: 2.5, unit: 'hours', status: 'nominal' },
    caloriesBurned: { current: 2180, target: 2500, unit: 'kcal' },
    muscleMass: { current: 94, baseline: 100, unit: '%', status: 'nominal', trend: 'stable' },
    boneDensity: { current: 96, baseline: 100, unit: '%', status: 'nominal', trend: 'slight decline' },
    vo2Max: { current: 42, unit: 'mL/kg/min', status: 'nominal' },
    weeklyGoalProgress: 78,
  },
  'plt-02': {
    dailyExercise: { completed: 2.3, required: 2.5, unit: 'hours', status: 'nominal' },
    caloriesBurned: { current: 2350, target: 2500, unit: 'kcal' },
    muscleMass: { current: 95, baseline: 100, unit: '%', status: 'nominal', trend: 'stable' },
    boneDensity: { current: 97, baseline: 100, unit: '%', status: 'nominal', trend: 'stable' },
    vo2Max: { current: 45, unit: 'mL/kg/min', status: 'nominal' },
    weeklyGoalProgress: 85,
  },
  'eng-03': {
    dailyExercise: { completed: 1.2, required: 2.5, unit: 'hours', status: 'warning' },
    caloriesBurned: { current: 1800, target: 2500, unit: 'kcal' },
    muscleMass: { current: 89, baseline: 100, unit: '%', status: 'warning', trend: 'declining' },
    boneDensity: { current: 91, baseline: 100, unit: '%', status: 'warning', trend: 'declining' },
    vo2Max: { current: 36, unit: 'mL/kg/min', status: 'warning' },
    weeklyGoalProgress: 45,
  },
  'sci-04': {
    dailyExercise: { completed: 2.4, required: 2.5, unit: 'hours', status: 'nominal' },
    caloriesBurned: { current: 2420, target: 2500, unit: 'kcal' },
    muscleMass: { current: 96, baseline: 100, unit: '%', status: 'nominal', trend: 'stable' },
    boneDensity: { current: 95, baseline: 100, unit: '%', status: 'nominal', trend: 'stable' },
    vo2Max: { current: 44, unit: 'mL/kg/min', status: 'nominal' },
    weeklyGoalProgress: 90,
  },
}

export function generateExerciseLog() {
  const exercises = [
    { name: 'Treadmill (COLBERT)', type: 'Cardio', icon: '🏃' },
    { name: 'ARED Resistance', type: 'Strength', icon: '🏋️' },
    { name: 'Cycle Ergometer', type: 'Cardio', icon: '🚴' },
    { name: 'CEVIS Bike', type: 'Cardio', icon: '🚲' },
    { name: 'Resistance Bands', type: 'Strength', icon: '💪' },
  ]
  const data = []
  for (let i = 0; i < 7; i++) {
    const dayExercises = []
    const numExercises = 2 + Math.floor(Math.random() * 2)
    const shuffled = [...exercises].sort(() => Math.random() - 0.5)
    for (let j = 0; j < numExercises; j++) {
      dayExercises.push({
        ...shuffled[j],
        duration: 20 + Math.floor(Math.random() * 40),
        calories: 150 + Math.floor(Math.random() * 200),
        heartRateAvg: 110 + Math.floor(Math.random() * 40),
      })
    }
    data.push({
      day: `Day ${141 + i}`,
      exercises: dayExercises,
      totalDuration: dayExercises.reduce((sum, e) => sum + e.duration, 0),
      totalCalories: dayExercises.reduce((sum, e) => sum + e.calories, 0),
    })
  }
  return data
}

export function generateMuscleTrend() {
  const data = []
  for (let i = 0; i < 20; i++) {
    const week = i + 1
    data.push({
      week: `Week ${week}`,
      upper: parseFloat((100 - week * 0.25 + (Math.random() - 0.5) * 1).toFixed(1)),
      lower: parseFloat((100 - week * 0.35 + (Math.random() - 0.5) * 1).toFixed(1)),
      core: parseFloat((100 - week * 0.15 + (Math.random() - 0.5) * 1).toFixed(1)),
    })
  }
  return data
}
