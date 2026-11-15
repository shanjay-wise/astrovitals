/**
 * Default Seed Astronaut Profiles
 * 4 archetypes as specified:
 * 1. Fully Nominal (Cmdr. Sarah Chen)
 * 2. Developing Bone/Muscle Loss (Lt. Erik Johansson)
 * 3. Sleep & Stress Problems (Dr. Aisha Patel)
 * 4. Radiation Warning Trigger (Dr. James Rodriguez)
 */

export const defaultAstronauts = [
  {
    id: 'astro-cmd-01',
    name: 'Cmdr. Sarah Chen',
    age: 42,
    sex: 'female',
    heightCm: 168,
    weightKg: 61,
    role: 'Mission Commander',
    mission: 'Artemis VII - Mars Transit',
    avatar: '👩‍🚀',
    bloodType: 'O+',
    missionDay: 147,
    baselines: {
      hr: 68,
      hrv: 52,
      bpSys: 116,
      bpDia: 74,
      spo2: 98.4,
      resp: 14,
      coreTemp: 36.7,
      sleepHrs: 7.5,
      boneDensity: 99.2,
      muscleMass: 98.5,
      hydration: 94.0
    },
    archetype: 'nominal',
    healthScore: 96,
    status: 'nominal',
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'astro-eng-02',
    name: 'Lt. Erik Johansson',
    age: 39,
    sex: 'male',
    heightCm: 184,
    weightKg: 82,
    role: 'Flight Engineer / EVA Specialist',
    mission: 'Artemis VII - Mars Transit',
    avatar: '👨‍🔧',
    bloodType: 'A+',
    missionDay: 147,
    baselines: {
      hr: 72,
      hrv: 44,
      bpSys: 122,
      bpDia: 78,
      spo2: 97.8,
      resp: 15,
      coreTemp: 36.8,
      sleepHrs: 6.8,
      boneDensity: 91.4, // Bone loss
      muscleMass: 88.2,  // Muscle atrophy
      hydration: 89.0
    },
    archetype: 'bone_muscle_loss',
    healthScore: 78,
    status: 'caution',
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'astro-bio-03',
    name: 'Dr. Aisha Patel',
    age: 35,
    sex: 'female',
    heightCm: 162,
    weightKg: 55,
    role: 'Payload Specialist - BioMed',
    mission: 'Artemis VII - Mars Transit',
    avatar: '👩‍🔬',
    bloodType: 'B+',
    missionDay: 147,
    baselines: {
      hr: 86, // Elevated
      hrv: 26, // Low HRV / Autonomic strain
      bpSys: 134,
      bpDia: 88,
      spo2: 96.2,
      resp: 19,
      coreTemp: 37.4, // Elevated "Space Fever"
      sleepHrs: 4.8, // Sleep deprivation
      boneDensity: 97.0,
      muscleMass: 94.0,
      hydration: 82.0
    },
    archetype: 'sleep_stress',
    healthScore: 69,
    status: 'caution',
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'astro-plt-04',
    name: 'Dr. James Rodriguez',
    age: 44,
    sex: 'male',
    heightCm: 178,
    weightKg: 75,
    role: 'Lead Pilot / Systems Officer',
    mission: 'Artemis VII - Mars Transit',
    avatar: '👨‍🚀',
    bloodType: 'AB+',
    missionDay: 147,
    baselines: {
      hr: 74,
      hrv: 48,
      bpSys: 120,
      bpDia: 76,
      spo2: 98.0,
      resp: 15,
      coreTemp: 36.9,
      sleepHrs: 7.0,
      boneDensity: 96.5,
      muscleMass: 95.0,
      hydration: 91.0
    },
    archetype: 'radiation_alert',
    healthScore: 74,
    status: 'critical', // Radiation warning
    createdAt: '2026-06-01T00:00:00Z'
  }
]
