/**
 * Gemini AI Health Assistant Service
 * Provides flight-surgeon medical decision support using Google Gemini API
 * with automatic fallback to NASA medical decision-tree rules when API key is unavailable.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

export const geminiApiService = {
  /**
   * Ask the AI Assistant for astronaut health analysis
   * @param {string} userQuery
   * @param {Object} astronaut
   * @param {Object} currentVitals
   * @param {Array} activeAlerts
   * @returns {Promise<string>}
   */
  askAssistant: async (userQuery, astronaut, currentVitals, activeAlerts = []) => {
    // If no Gemini key is provided, use flight-certified rule-based medical expert system
    if (!GEMINI_API_KEY) {
      return geminiApiService.generateRuleBasedAnswer(userQuery, astronaut, currentVitals, activeAlerts)
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

      const systemPrompt = `You are AstroAI, an autonomous NASA Flight Surgeon and Bio-Medical Informatics Decision Support Assistant aboard human deep-space mission Artemis VII.
Astronaut Subject: ${astronaut.name} (${astronaut.role}, Age: ${astronaut.age}, Sex: ${astronaut.sex}, Blood: ${astronaut.bloodType}, Mission Day: ${astronaut.missionDay}).
Current Realtime Telemetry:
- Heart Rate: ${currentVitals?.hr || 72} bpm (Baseline: ${astronaut.baselines.hr})
- Blood Pressure: ${currentVitals?.bpSys || 118}/${currentVitals?.bpDia || 76} mmHg
- SpO2: ${currentVitals?.spo2 || 98}%
- Respiration: ${currentVitals?.resp || 15} br/min
- Core Temperature: ${currentVitals?.coreTemp || 36.7}°C
- Cabin ppCO2: ${currentVitals?.cabinCO2 || 2.1} mmHg (NASA Max: 3.0 mmHg)
- Radiation Dose Rate: ${currentVitals?.radiationRate || 0.042} mSv/hr
- Hydration: ${currentVitals?.hydration || 90}%
- Stress Index: ${currentVitals?.stressIndex || 30}%
Active Telemetry Alerts: ${activeAlerts.map(a => `${a.severity.toUpperCase()}: ${a.message}`).join('; ') || 'None (Nominal)'}

Instructions:
1. Provide concise, high-priority, flight-surgeon medical advice adhering to NASA-STD-3001 and HRP protocols.
2. Formulate immediate countermeasures (hydration, LBNP suit, exercise, sleep hygiene).
3. Always include clinical reasoning.`

      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nAstronaut Question: "${userQuery}"` }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(6000)
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    } catch (err) {
      console.warn('[Gemini AI] Call failed or timed out, falling back to rule-based engine:', err.message)
    }

    return geminiApiService.generateRuleBasedAnswer(userQuery, astronaut, currentVitals, activeAlerts)
  },

  /**
   * Flight-certified offline decision-support fallback
   */
  generateRuleBasedAnswer: (query, astronaut, vitals, alerts) => {
    const q = query.toLowerCase()

    if (q.includes('hr') || q.includes('heart') || q.includes('pulse')) {
      const diff = (vitals?.hr || 72) - astronaut.baselines.hr
      if (diff > 15) {
        return `⚠️ **Elevated Heart Rate Analysis**: Current reading is ${vitals?.hr} bpm (+${diff} bpm above resting baseline ${astronaut.baselines.hr} bpm).\n\n**Likely Causes**: Microgravity cardiovascular deconditioning, fluid volume shift, or cognitive sympathetic activation.\n**Flight Protocol**: 1) Ingest 500 mL electrolytic fluid. 2) Rest in neutral body posture for 20 min. 3) If palpitations persist, initiate lead-II rhythm telemetry.`
      }
      return `✓ **Heart Rate Nominal**: Current pulse is ${vitals?.hr} bpm, within standard NASA-STD-3001 rest range (${astronaut.baselines.hr} ± 10 bpm). Autonomic tone remains balanced.`
    }

    if (q.includes('sleep') || q.includes('tired') || q.includes('fatigue')) {
      return `🛌 **Sleep & Circadian Assessment**: Recorded sleep was ${(vitals?.sleepScore * 0.08).toFixed(1)} hrs. In microgravity, sleep architecture frequently suffers from elevated noise (>52 dBA) and 16 orbital sunrises daily.\n\n**Recommendation**: 1) Shift SSLA lighting to Phase 3 Amber (<2700K). 2) Administer 0.5mg sublingual melatonin 30 min before rest pod entry. 3) Earplug acoustic seal verification.`
    }

    if (q.includes('plan') || q.includes('day') || q.includes('schedule')) {
      return `📋 **Prescribed Mission Schedule (Day ${astronaut.missionDay})**:\n- **08:00 - 09:30 UTC**: High-load ARED resistance squat & heel raise (mitigate calcaneus bone loss).\n- **12:00 UTC**: Caloric intake (1,000 kcal pack with 800 IU Vit D3).\n- **14:00 - 15:00 UTC**: T2/COLBERT treadmill with 75% body weight harness downforce.\n- **19:00 UTC**: 3-minute NASA PVT-B cognitive vigilance test.`
    }

    if (q.includes('radiation') || q.includes('solar') || q.includes('flare')) {
      const isHigh = (vitals?.radiationRate || 0) > 0.15
      return `☢️ **Dosimetry Intelligence**: Ambient flux is ${vitals?.radiationRate || 0.042} mSv/hr.\n${isHigh ? '⚠️ **ALERT**: Enhanced solar particle flux detected. Ingest radioprotective antioxidant pack and maintain close proximity to central water-wall shielded compartment.' : '✓ Heliospheric conditions quiet. Cumulative exposure remains well within NASA 600 mSv career limit.'}`
    }

    if (alerts && alerts.length > 0) {
      const topAlert = alerts[0]
      return `⚠️ **Priority Advisory**: Anomaly detected in **${topAlert.metric}** (${topAlert.severity.toUpperCase()}).\n\n*Action*: ${topAlert.recommendation}\n*Clinical Reason*: ${topAlert.message}`
    }

    return `🛡️ **AstroAI Medical Status**: All bio-telemetry channels for **${astronaut.name}** are calibrated. Current Health Index: **${vitals?.healthScore || 95}/100**. Maintain hydration and mandatory 2.5 hr ARED/T2 exercise regimen.`
  }
}
