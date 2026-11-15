/**
 * ASTROVITALS Core Data Models & Types
 * Team: Proxyma Dynamics | NASA Space Apps Challenge 2026
 */

/**
 * @typedef {Object} Baselines
 * @property {number} hr - Resting Heart Rate (bpm)
 * @property {number} hrv - Heart Rate Variability RMSSD (ms)
 * @property {number} bpSys - Systolic Blood Pressure (mmHg)
 * @property {number} bpDia - Diastolic Blood Pressure (mmHg)
 * @property {number} spo2 - Blood Oxygen Saturation (%)
 * @property {number} resp - Respiration Rate (breaths/min)
 * @property {number} coreTemp - Core Body Temperature (°C)
 * @property {number} sleepHrs - Target Sleep Duration (hrs)
 * @property {number} boneDensity - Baseline Bone Mineral Density (%)
 * @property {number} muscleMass - Baseline Muscle Mass (%)
 * @property {number} hydration - Baseline Hydration Level (%)
 */

/**
 * @typedef {Object} Astronaut
 * @property {string} id
 * @property {string} name
 * @property {number} age
 * @property {('male'|'female')} sex
 * @property {number} heightCm
 * @property {number} weightKg
 * @property {string} role
 * @property {string} mission
 * @property {string} avatar
 * @property {string} bloodType
 * @property {number} missionDay
 * @property {Baselines} baselines
 * @property {string} createdAt
 */

/**
 * @typedef {Object} VitalSample
 * @property {string} astronautId
 * @property {number} timestamp
 * @property {string} metric
 * @property {number} value
 * @property {string} unit
 * @property {('nominal'|'caution'|'critical')} status
 */

/**
 * @typedef {Object} Alert
 * @property {string} id
 * @property {string} astronautId
 * @property {string} timestamp
 * @property {('info'|'warning'|'critical')} severity
 * @property {string} metric
 * @property {string} message
 * @property {string} recommendation
 * @property {boolean} acknowledged
 * @property {boolean} [dismissed]
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} id
 * @property {('exercise'|'diet'|'hydration'|'sleep'|'mental'|'medical')} category
 * @property {string} text
 * @property {string} reason
 * @property {('high'|'medium'|'low')} priority
 */
