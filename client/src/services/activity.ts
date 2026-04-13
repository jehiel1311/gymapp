import type { ActivityEntry } from '../models/activity'

const STORAGE_KEY = 'activity_log'

export function loadActivities(): ActivityEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored) as ActivityEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveActivities(entries: ActivityEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}
