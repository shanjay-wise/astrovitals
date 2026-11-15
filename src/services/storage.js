/**
 * Storage Service
 * Abstraction layer over localStorage / client storage to allow transparent swap with backend API
 */

const STORAGE_PREFIX = 'astrovitals_'

export const storageService = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (err) {
      console.warn(`[StorageService] Failed to read key "${key}":`, err)
      return defaultValue
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
      return true
    } catch (err) {
      console.error(`[StorageService] Failed to write key "${key}":`, err)
      return false
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
      return true
    } catch (err) {
      console.error(`[StorageService] Failed to remove key "${key}":`, err)
      return false
    }
  },

  clearAll: () => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(STORAGE_PREFIX))
        .forEach(k => localStorage.removeItem(k))
      return true
    } catch (err) {
      console.error('[StorageService] Failed to clear storage:', err)
      return false
    }
  }
}
