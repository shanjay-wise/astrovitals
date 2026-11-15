/**
 * NASA API Service
 * Handles DONKI (Space Weather FLR & CME), APOD, and OSDR calls with caching & fallback
 * Complies with NASA open API conventions: reads import.meta.env.VITE_NASA_API_KEY for APOD
 */

import { storageService } from './storage'
import { sampleDonkiEvents, sampleCmeEvents, sampleApod, osdrGeneLabDatasets } from '../data/nasaSampleData'

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const DONKI_BASE_URL = 'https://ccmc.gsfc.nasa.gov/DONKI-API/get'

/**
 * Calculates startDate and endDate from today's real date (YYYY-MM-DD)
 */
const getDonkiDateRange = (daysBack = 30) => {
  const today = new Date()
  const endDate = today.toISOString().split('T')[0]
  const startDate = new Date(today.getTime() - daysBack * 86400000).toISOString().split('T')[0]
  return { startDate, endDate }
}

const inflightRequests = new Map()

/**
 * Fetch helper for DONKI API endpoints with Vite dev proxy fallback for CORS
 */
const fetchDonkiData = async (endpoint, startDate, endDate) => {
  const query = `startDate=${startDate}&endDate=${endDate}`
  const directUrl = `${DONKI_BASE_URL}/${endpoint}?${query}`
  const proxyUrl = `/DONKI-API/get/${endpoint}?${query}`
  const requestKey = `${endpoint}_${startDate}_${endDate}`

  if (inflightRequests.has(requestKey)) {
    return inflightRequests.get(requestKey)
  }

  const promise = (async () => {
    try {
      const res = await fetch(directUrl, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (!Array.isArray(json)) throw new Error('Expected array response from DONKI API')
      return json
    } catch (directErr) {
      // If browser blocks the request with CORS or direct fetch fails, fallback to Vite dev proxy
      try {
        const proxyRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) })
        if (proxyRes.ok) {
          const json = await proxyRes.json()
          if (Array.isArray(json)) return json
        }
      } catch {
        // Dev proxy also failed or unavailable
      }
      throw directErr
    }
  })().finally(() => {
    inflightRequests.delete(requestKey)
  })

  inflightRequests.set(requestKey, promise)
  return promise
}

export const nasaApiService = {
  /**
   * Fetch DONKI Solar Flares for the last N days (default 30 days)
   * @param {number} daysBack
   * @returns {Promise<{ data: Array, source: ('LIVE'|'CACHED'|'SIMULATED'), timestamp: string }>}
   */
  getSolarFlares: async (daysBack = 30) => {
    const cacheKey = `donki_flr_${daysBack}`
    const cached = storageService.getItem(cacheKey)

    const { startDate, endDate } = getDonkiDateRange(daysBack)

    try {
      const data = await fetchDonkiData('FLR', startDate, endDate)
      storageService.setItem(cacheKey, { data, fetchedAt: Date.now() })
      return { data, source: 'LIVE', timestamp: new Date().toISOString() }
    } catch (err) {
      console.warn('[NASA DONKI FLR API] Request failed. Falling back to cached/simulated data:', err.message)
    }

    // Fallback to cached if using the last saved response, else simulated only if request fails
    if (cached && cached.data) {
      return { data: cached.data, source: 'CACHED', timestamp: new Date(cached.fetchedAt).toISOString() }
    }
    return { data: sampleDonkiEvents, source: 'SIMULATED', timestamp: new Date().toISOString() }
  },

  /**
   * Fetch DONKI Coronal Mass Ejections (CME) for the last N days (default 30 days)
   * @param {number} daysBack
   * @returns {Promise<{ data: Array, source: ('LIVE'|'CACHED'|'SIMULATED'), timestamp: string }>}
   */
  getCmeEvents: async (daysBack = 30) => {
    const cacheKey = `donki_cme_${daysBack}`
    const cached = storageService.getItem(cacheKey)

    const { startDate, endDate } = getDonkiDateRange(daysBack)

    try {
      const data = await fetchDonkiData('CME', startDate, endDate)
      storageService.setItem(cacheKey, { data, fetchedAt: Date.now() })
      return { data, source: 'LIVE', timestamp: new Date().toISOString() }
    } catch (err) {
      console.warn('[NASA DONKI CME API] Failed, using fallback:', err.message)
    }

    if (cached && cached.data) {
      return { data: cached.data, source: 'CACHED', timestamp: new Date(cached.fetchedAt).toISOString() }
    }
    return { data: sampleCmeEvents, source: 'SIMULATED', timestamp: new Date().toISOString() }
  },

  /**
   * Unified Space Weather Stream (Solar Flares + CMEs for the last 30 days)
   * Returns combined sorted event list and overall data source label
   */
  getSpaceWeather: async (daysBack = 30) => {
    const [flrResult, cmeResult] = await Promise.all([
      nasaApiService.getSolarFlares(daysBack),
      nasaApiService.getCmeEvents(daysBack)
    ])

    // Format solar flare events
    const formattedFlares = (flrResult.data || []).map(f => ({
      id: f.flrID || `FLR-${f.beginTime}`,
      type: 'FLR',
      typeLabel: 'Solar Flare',
      classType: f.classType || 'C-Class',
      time: f.peakTime || f.beginTime,
      sourceLocation: f.sourceLocation || 'Disk Center',
      note: f.note || `Solar flare radiation peak flux detected.`
    }))

    // Format CME events
    const formattedCmes = (cmeResult.data || []).map(c => ({
      id: c.activityID || `CME-${c.startTime}`,
      type: 'CME',
      typeLabel: 'Coronal Mass Ejection',
      classType: c.cmeAnalyses?.[0]?.speed ? `${Math.round(c.cmeAnalyses[0].speed)} km/s` : 'Interplanetary CME',
      time: c.startTime,
      sourceLocation: c.sourceLocation || 'Solar Limb',
      note: c.note || `Plasma cloud propagation toward Mars transit corridor.`
    }))

    // Combine and sort chronologically descending (newest first)
    const combined = [...formattedFlares, ...formattedCmes].sort(
      (a, b) => new Date(b.time || 0) - new Date(a.time || 0)
    )

    // Determine overall source: LIVE if either is LIVE, CACHED if either is CACHED, else SIMULATED
    let source = 'SIMULATED'
    if (flrResult.source === 'LIVE' || cmeResult.source === 'LIVE') {
      source = 'LIVE'
    } else if (flrResult.source === 'CACHED' || cmeResult.source === 'CACHED') {
      source = 'CACHED'
    }

    return {
      events: combined,
      flares: flrResult.data,
      cmes: cmeResult.data,
      source,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Fetch NASA Astronomy Picture of the Day (APOD)
   */
  getApod: async () => {
    const cacheKey = 'nasa_apod'
    const cached = storageService.getItem(cacheKey)
    if (cached && Date.now() - cached.fetchedAt < 24 * 60 * 60 * 1000) {
      return { data: cached.data, source: 'CACHED', timestamp: new Date(cached.fetchedAt).toISOString() }
    }

    try {
      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data && (data.url || data.hdurl)) {
        storageService.setItem(cacheKey, { data, fetchedAt: Date.now() })
        return { data, source: 'LIVE', timestamp: new Date().toISOString() }
      }
    } catch (err) {
      console.warn('[NASA APOD] Request failed, using fallback:', err.message)
    }

    if (cached && cached.data) {
      return { data: cached.data, source: 'CACHED', timestamp: new Date(cached.fetchedAt).toISOString() }
    }
    return { data: sampleApod, source: 'SIMULATED', timestamp: new Date().toISOString() }
  },

  /**
   * Get NASA Open Science Data Repository (OSDR) Datasets
   */
  getOsdrDatasets: () => {
    return osdrGeneLabDatasets
  }
}
