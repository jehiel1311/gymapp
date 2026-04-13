import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ACTIVITY_LABELS,
  type ActivityEntry,
  type ActivityType,
  type ExerciseSet,
  type LoggedExercise
} from '../../models/activity'
import { loadActivities, saveActivities } from '../../services/activity'
import exercisesCatalog from '../../data/exercises.json'

interface WeeklyGoal {
  sessions: number
  minutes: number
}

const WEEKLY_GOAL: WeeklyGoal = {
  sessions: 4,
  minutes: 180
}

const todayISO = new Date().toISOString().slice(0, 10)
const ACTIVITY_TYPES_WITH_EXERCISES: ActivityType[] = ['weights']

interface CatalogExercise {
  ID: string
  'Nombre (ES)': string
  'Zona principal': string
}

const DEFAULT_SETS: ExerciseSet[] = [
  { reps: '', weightKg: '' },
  { reps: '', weightKg: '' },
  { reps: '', weightKg: '' }
]

function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function isSameMonth(date: Date, ref: Date): boolean {
  return date.getMonth() === ref.getMonth() && date.getFullYear() === ref.getFullYear()
}

function isSameYear(date: Date, ref: Date): boolean {
  return date.getFullYear() === ref.getFullYear()
}

function summarize(entries: ActivityEntry[]) {
  const totalMinutes = entries.reduce((acc, item) => acc + item.durationMinutes, 0)
  const totalKm = entries.reduce((acc, item) => acc + (item.distanceKm ?? 0), 0)
  return {
    sessions: entries.length,
    totalMinutes,
    totalKm: Number(totalKm.toFixed(1))
  }
}

export default function CalendarPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>(() => loadActivities())
  const [date, setDate] = useState(todayISO)
  const [type, setType] = useState<ActivityType>('running')
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [distanceKm, setDistanceKm] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [exerciseDetails, setExerciseDetails] = useState<Record<string, ExerciseSet[]>>({})
  const [selectedMuscle, setSelectedMuscle] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [notes, setNotes] = useState('')
  const [routineSummary, setRoutineSummary] = useState('')
  const [formError, setFormError] = useState('')

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  )

  const now = new Date()
  const weekStart = startOfWeek(now)

  const weeklyEntries = useMemo(
    () => entries.filter((entry) => new Date(entry.date) >= weekStart),
    [entries, weekStart]
  )

  const monthlyEntries = useMemo(
    () => entries.filter((entry) => isSameMonth(new Date(entry.date), now)),
    [entries, now]
  )

  const yearlyEntries = useMemo(
    () => entries.filter((entry) => isSameYear(new Date(entry.date), now)),
    [entries, now]
  )

  const weeklySummary = summarize(weeklyEntries)
  const monthlySummary = summarize(monthlyEntries)
  const yearlySummary = summarize(yearlyEntries)

  const weeklyStatusText =
    weeklySummary.sessions >= WEEKLY_GOAL.sessions && weeklySummary.totalMinutes >= WEEKLY_GOAL.minutes
      ? 'Vas excelente esta semana: cumpliste tus metas 💪'
      : 'Vas avanzando. Intenta sumar más sesiones o minutos para cumplir la meta semanal.'

  const showExerciseSelectors = ACTIVITY_TYPES_WITH_EXERCISES.includes(type)

  const muscleOptions = useMemo(() => {
    if (!showExerciseSelectors) return []
    const muscles = new Set<string>()
    ;(exercisesCatalog as CatalogExercise[]).forEach((exercise) => muscles.add(exercise['Zona principal']))
    return Array.from(muscles).sort((a, b) => a.localeCompare(b, 'es'))
  }, [showExerciseSelectors])

  const exerciseOptions = useMemo(() => {
    if (!showExerciseSelectors || !selectedMuscle) return []
    return (exercisesCatalog as CatalogExercise[])
      .filter((exercise) => exercise['Zona principal'] === selectedMuscle)
      .map((exercise) => exercise['Nombre (ES)'])
      .sort((a, b) => a.localeCompare(b, 'es'))
  }, [selectedMuscle, showExerciseSelectors])

  const handleTypeChange = (newType: ActivityType) => {
    setType(newType)
    setSelectedMuscle('')
    setSelectedExercise('')
    setSelectedExercises([])
    setExerciseDetails({})
    setRoutineSummary('')
    setFormError('')
  }

  const handleAddExercise = () => {
    if (!selectedExercise) return
    if (selectedExercises.includes(selectedExercise)) return
    setSelectedExercises((prev) => [...prev, selectedExercise])
    setExerciseDetails((prev) => ({
      ...prev,
      [selectedExercise]: DEFAULT_SETS.map((set) => ({ ...set }))
    }))
    setSelectedExercise('')
    setFormError('')
  }

  const handleRemoveExercise = (exerciseName: string) => {
    setSelectedExercises((prev) => prev.filter((name) => name !== exerciseName))
    setExerciseDetails((prev) => {
      const updated = { ...prev }
      delete updated[exerciseName]
      return updated
    })
  }

  const handleSetChange = (
    exerciseName: string,
    setIndex: number,
    field: keyof ExerciseSet,
    value: string
  ) => {
    setExerciseDetails((prev) => {
      const exerciseSets = prev[exerciseName] ?? DEFAULT_SETS.map((set) => ({ ...set }))
      const updatedSets = exerciseSets.map((set, index) =>
        index === setIndex ? { ...set, [field]: value } : set
      )
      return {
        ...prev,
        [exerciseName]: updatedSets
      }
    })
  }

  const handleAddSet = (exerciseName: string) => {
    setExerciseDetails((prev) => {
      const exerciseSets = prev[exerciseName] ?? DEFAULT_SETS.map((set) => ({ ...set }))
      return {
        ...prev,
        [exerciseName]: [...exerciseSets, { reps: '', weightKg: '' }]
      }
    })
  }

  const buildExerciseDetails = (): LoggedExercise[] | undefined => {
    if (!showExerciseSelectors || selectedExercises.length === 0) return undefined

    const details = selectedExercises.map((exerciseName) => {
      const sets = (exerciseDetails[exerciseName] ?? DEFAULT_SETS)
        .map((set) => ({ reps: set.reps.trim(), weightKg: set.weightKg.trim() }))
        .filter((set) => set.reps || set.weightKg)

      return {
        name: exerciseName,
        sets
      }
    })

    return details
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')

    if (showExerciseSelectors && selectedExercises.length === 0) {
      setFormError('Para actividades de pesas, agregá al menos un ejercicio realizado.')
      return
    }

    const normalizedDistance = distanceKm.trim() ? Number(distanceKm) : undefined

    const savedExerciseDetails = buildExerciseDetails()

    const combinedNotes = [notes.trim(), showExerciseSelectors ? routineSummary.trim() : '']
      .filter(Boolean)
      .join('\n')

    const newEntry: ActivityEntry = {
      id: crypto.randomUUID(),
      date,
      type,
      durationMinutes,
      distanceKm: Number.isFinite(normalizedDistance) ? normalizedDistance : undefined,
      exerciseDetails: savedExerciseDetails,
      exercises: showExerciseSelectors && selectedExercises.length > 0 ? selectedExercises.join(', ') : undefined,
      notes: combinedNotes || undefined,
      createdAt: new Date().toISOString()
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    saveActivities(updated)

    setDurationMinutes(30)
    setDistanceKm('')
    setSelectedExercises([])
    setExerciseDetails({})
    setNotes('')
    setRoutineSummary('')
    setFormError('')
  }

  return (
    <div className="page-shell stack">
      <section className="panel">
        <h1 className="text-xl font-bold mb-2">Registro de actividad</h1>
        <p style={{ color: '#475569', marginTop: 0 }}>
          Aquí podés guardar todo lo que hacés: correr, pesas, caminatas, bici y más.
        </p>
        <Link to="/perfil" className="text-blue-500">Volver al perfil</Link>
      </section>

      <section className="panel">
        <h2 className="text-xl font-bold mb-2">Agregar actividad</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span className="label">Fecha</span>
            <input type="date" value={date} max={todayISO} onChange={(e) => setDate(e.target.value)} required />
          </label>

          <label>
            <span className="label">Tipo</span>
            <select value={type} onChange={(e) => handleTypeChange(e.target.value as ActivityType)}>
              {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="label">Duración (min)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              required
            />
          </label>

          <label>
            <span className="label">Distancia en km (opcional)</span>
            <input
              type="number"
              min={0}
              step={0.1}
              placeholder="Ej: 5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
          </label>

          {showExerciseSelectors && (
            <>
              <label>
                <span className="label">Músculo / zona principal</span>
                <select value={selectedMuscle} onChange={(e) => setSelectedMuscle(e.target.value)}>
                  <option value="">Seleccionar zona</option>
                  {muscleOptions.map((muscle) => (
                    <option key={muscle} value={muscle}>{muscle}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="label">Ejercicio</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    disabled={!selectedMuscle}
                  >
                    <option value="">{selectedMuscle ? 'Seleccionar ejercicio' : 'Elegí un músculo primero'}</option>
                    {exerciseOptions.map((exerciseName) => (
                      <option key={exerciseName} value={exerciseName}>{exerciseName}</option>
                    ))}
                  </select>
                  <button type="button" onClick={handleAddExercise} disabled={!selectedExercise}>
                    + Agregar
                  </button>
                </div>
              </label>
            </>
          )}

          {showExerciseSelectors && (
            <label style={{ gridColumn: '1 / -1' }}>
              <span className="label">Ejercicios realizados</span>
              {selectedExercises.length === 0 ? (
                <p style={{ margin: '0.35rem 0 0 0', color: '#64748b' }}>
                  Agregá ejercicios para cargar series y peso (arranca con 3 series por ejercicio).
                </p>
              ) : (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedExercises.map((exerciseName) => (
                    <button
                      key={exerciseName}
                      type="button"
                      onClick={() => handleRemoveExercise(exerciseName)}
                      style={{ fontSize: '0.85rem' }}
                      title="Quitar ejercicio"
                    >
                      {exerciseName} ✕
                    </button>
                  ))}
                </div>
              )}
            </label>
          )}

          {showExerciseSelectors && selectedExercises.length > 0 && (
            <div style={{ gridColumn: '1 / -1' }} className="stack">
              {selectedExercises.map((exerciseName) => {
                const sets = exerciseDetails[exerciseName] ?? DEFAULT_SETS
                return (
                  <article key={exerciseName} className="set-card">
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>{exerciseName}</p>
                    <div className="set-grid">
                      <span className="set-header">Serie</span>
                      <span className="set-header">Reps</span>
                      <span className="set-header">Peso (kg)</span>

                      {sets.map((set, setIndex) => (
                        <div className="set-row" key={`${exerciseName}-${setIndex}`}>
                          <span>{setIndex + 1}</span>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            placeholder="10"
                            value={set.reps}
                            onChange={(e) => handleSetChange(exerciseName, setIndex, 'reps', e.target.value)}
                          />
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            placeholder="20"
                            value={set.weightKg}
                            onChange={(e) => handleSetChange(exerciseName, setIndex, 'weightKg', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => handleAddSet(exerciseName)}>
                      + Agregar serie
                    </button>
                  </article>
                )
              })}
            </div>
          )}

          <label style={{ gridColumn: '1 / -1' }}>
            {showExerciseSelectors && (
              <>
                <span className="label">Detalle completo de la rutina (opcional)</span>
                <textarea
                  placeholder="Ej: Superserie pecho/hombro, descansos de 90s, técnica usada, etc."
                  value={routineSummary}
                  onChange={(e) => setRoutineSummary(e.target.value)}
                />
              </>
            )}
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            <span className="label">Notas (opcional)</span>
            <textarea
              placeholder="Cómo te sentiste, cargas usadas, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <div>
            {formError && (
              <p style={{ margin: '0 0 0.5rem 0', color: '#b91c1c', fontWeight: 600 }}>
                {formError}
              </p>
            )}
            <button type="submit" className="bg-green-600">Guardar actividad</button>
          </div>
        </form>
      </section>

      <section className="panel">
        <h2 className="text-xl font-bold mb-2">Progreso semanal / mensual / anual</h2>
        <div className="form-grid">
          <article>
            <h3 style={{ marginBottom: '0.5rem' }}>Semana actual</h3>
            <p>Sesiones: <strong>{weeklySummary.sessions}</strong></p>
            <p>Minutos: <strong>{weeklySummary.totalMinutes}</strong></p>
            <p>Kilómetros: <strong>{weeklySummary.totalKm}</strong></p>
            <p style={{ color: '#1e3a8a' }}>{weeklyStatusText}</p>
          </article>
          <article>
            <h3 style={{ marginBottom: '0.5rem' }}>Mes actual</h3>
            <p>Sesiones: <strong>{monthlySummary.sessions}</strong></p>
            <p>Minutos: <strong>{monthlySummary.totalMinutes}</strong></p>
            <p>Kilómetros: <strong>{monthlySummary.totalKm}</strong></p>
          </article>
          <article>
            <h3 style={{ marginBottom: '0.5rem' }}>Año actual</h3>
            <p>Sesiones: <strong>{yearlySummary.sessions}</strong></p>
            <p>Minutos: <strong>{yearlySummary.totalMinutes}</strong></p>
            <p>Kilómetros: <strong>{yearlySummary.totalKm}</strong></p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2 className="text-xl font-bold mb-2">Historial</h2>
        {sortedEntries.length === 0 ? (
          <p style={{ color: '#475569' }}>Todavía no cargaste actividades.</p>
        ) : (
          <div className="stack">
            {sortedEntries.map((entry) => (
              <article key={entry.id} className="card" style={{ cursor: 'default' }}>
                <p style={{ margin: '0 0 0.25rem 0' }}>
                  <strong>{entry.date}</strong> · {ACTIVITY_LABELS[entry.type]}
                </p>
                <p style={{ margin: 0 }}>
                  Duración: {entry.durationMinutes} min
                  {entry.distanceKm ? ` · Distancia: ${entry.distanceKm} km` : ''}
                </p>
                {entry.exercises && <p style={{ margin: '0.35rem 0 0 0' }}><strong>Ejercicios:</strong> {entry.exercises}</p>}
                {entry.exerciseDetails && entry.exerciseDetails.length > 0 && (
                  <details style={{ marginTop: '0.5rem' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Ver detalle de series y pesos</summary>
                    <div className="stack" style={{ marginTop: '0.5rem' }}>
                      {entry.exerciseDetails.map((exercise) => (
                        <div key={exercise.name}>
                          <strong>{exercise.name}</strong>
                          {exercise.sets.length === 0 ? (
                            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b' }}>
                              Sin series cargadas.
                            </p>
                          ) : (
                            <ul style={{ margin: '0.35rem 0 0 1rem', padding: 0 }}>
                              {exercise.sets.map((set, index) => (
                                <li key={`${exercise.name}-set-${index}`}>
                                  Serie {index + 1}: {set.reps || '-'} reps · {set.weightKg || '-'} kg
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                {entry.notes && <p style={{ margin: '0.35rem 0 0 0' }}><strong>Notas:</strong> {entry.notes}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
