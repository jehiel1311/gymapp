export type ActivityType = 'running' | 'weights' | 'cycling' | 'walking' | 'other'

export interface ExerciseSet {
  reps: string
  weightKg: string
}

export interface LoggedExercise {
  name: string
  sets: ExerciseSet[]
}

export interface ActivityEntry {
  id: string
  date: string
  type: ActivityType
  durationMinutes: number
  distanceKm?: number
  exerciseDetails?: LoggedExercise[]
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
