import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ACTIVITY_LABELS, type ActivityEntry, type ActivityType } from '../../models/activity'
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
  const [exercises, setExercises] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [notes, setNotes] = useState('')

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
  }

  const handleAddExercise = () => {
    if (!selectedExercise) return
    const currentExercises = exercises
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (currentExercises.includes(selectedExercise)) return

    setExercises(currentExercises.length > 0 ? `${currentExercises.join(', ')}, ${selectedExercise}` : selectedExercise)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedDistance = distanceKm.trim() ? Number(distanceKm) : undefined

    const newEntry: ActivityEntry = {
      id: crypto.randomUUID(),
      date,
      type,
      durationMinutes,
      distanceKm: Number.isFinite(normalizedDistance) ? normalizedDistance : undefined,
      exercises: exercises.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    saveActivities(updated)

    setDurationMinutes(30)
    setDistanceKm('')
    setExercises('')
    setNotes('')
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
              </label>
            </>
          )}

          <label style={{ gridColumn: '1 / -1' }}>
            <span className="label">Ejercicios realizados (opcional)</span>
            <input
              type="text"
              placeholder="Ej: sentadilla 4x10, press banca 3x8"
              value={exercises}
              onChange={(e) => setExercises(e.target.value)}
            />
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
            {showExerciseSelectors && (
              <button type="button" onClick={handleAddExercise} disabled={!selectedExercise} style={{ marginBottom: '0.5rem' }}>
                Agregar ejercicio seleccionado
              </button>
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
                {entry.notes && <p style={{ margin: '0.35rem 0 0 0' }}><strong>Notas:</strong> {entry.notes}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
