export type ActivityType = 'running' | 'weights' | 'cycling' | 'walking' | 'other'

export interface ActivityEntry {
  id: string
  date: string
  type: ActivityType
  durationMinutes: number
  distanceKm?: number
  exercises?: string
  notes?: string
  createdAt: string
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  running: 'Correr',
  weights: 'Pesas',
  cycling: 'Bicicleta',
  walking: 'Caminar',
  other: 'Otro'
}
