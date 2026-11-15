export const emotionConfig = {
  'cmd-01': {
    stressIndex: { current: 28, max: 100, status: 'nominal', label: 'Low' },
    moodScore: { current: 82, max: 100, status: 'nominal', label: 'Positive' },
    sleepQuality: { current: 87, max: 100, status: 'nominal', hours: 7.2, label: 'Good' },
    cognitiveScore: { current: 91, max: 100, status: 'nominal', label: 'Excellent' },
    fatigueLevel: { current: 22, max: 100, status: 'nominal', label: 'Low' },
    socialInteraction: { current: 75, max: 100, status: 'nominal', label: 'Healthy' },
  },
  'plt-02': {
    stressIndex: { current: 35, max: 100, status: 'nominal', label: 'Moderate-Low' },
    moodScore: { current: 78, max: 100, status: 'nominal', label: 'Positive' },
    sleepQuality: { current: 72, max: 100, status: 'nominal', hours: 6.5, label: 'Adequate' },
    cognitiveScore: { current: 85, max: 100, status: 'nominal', label: 'Good' },
    fatigueLevel: { current: 30, max: 100, status: 'nominal', label: 'Low' },
    socialInteraction: { current: 68, max: 100, status: 'nominal', label: 'Adequate' },
  },
  'eng-03': {
    stressIndex: { current: 62, max: 100, status: 'warning', label: 'Elevated' },
    moodScore: { current: 55, max: 100, status: 'warning', label: 'Neutral' },
    sleepQuality: { current: 48, max: 100, status: 'warning', hours: 4.8, label: 'Poor' },
    cognitiveScore: { current: 71, max: 100, status: 'warning', label: 'Adequate' },
    fatigueLevel: { current: 65, max: 100, status: 'warning', label: 'High' },
    socialInteraction: { current: 42, max: 100, status: 'warning', label: 'Low' },
  },
  'sci-04': {
    stressIndex: { current: 30, max: 100, status: 'nominal', label: 'Low' },
    moodScore: { current: 80, max: 100, status: 'nominal', label: 'Positive' },
    sleepQuality: { current: 83, max: 100, status: 'nominal', hours: 7.0, label: 'Good' },
    cognitiveScore: { current: 88, max: 100, status: 'nominal', label: 'Good' },
    fatigueLevel: { current: 25, max: 100, status: 'nominal', label: 'Low' },
    socialInteraction: { current: 72, max: 100, status: 'nominal', label: 'Healthy' },
  },
}

export function generateStressTrend(baseStress = 30) {
  const data = []
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  for (let w = 0; w < 4; w++) {
    for (let d = 0; d < 7; d++) {
      data.push({
        day: `W${w + 1} ${days[d]}`,
        stress: Math.max(5, Math.min(95, Math.round(baseStress + (Math.random() - 0.5) * 25))),
        mood: Math.max(20, Math.min(100, Math.round(80 - baseStress / 2 + (Math.random() - 0.5) * 20))),
        sleep: Math.max(30, Math.min(100, Math.round(85 - baseStress / 3 + (Math.random() - 0.5) * 15))),
      })
    }
  }
  return data
}

export function generateMoodHistory() {
  const moods = ['😊', '😐', '😟', '😴', '🤔', '😤', '😌']
  const labels = ['Happy', 'Neutral', 'Anxious', 'Tired', 'Focused', 'Frustrated', 'Calm']
  const data = []
  for (let i = 0; i < 14; i++) {
    const idx = Math.random() > 0.6 ? 0 : Math.random() > 0.4 ? 6 : Math.floor(Math.random() * moods.length)
    data.push({
      day: `Day ${134 + i}`,
      mood: moods[idx],
      label: labels[idx],
      score: Math.round(70 + (Math.random() - 0.5) * 40),
    })
  }
  return data
}
