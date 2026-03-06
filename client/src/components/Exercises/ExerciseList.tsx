import { useEffect, useState } from 'react'
import { TextField, Checkbox, FormControlLabel, FormGroup, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import localExercises from '../../data/exercises.json'

interface Exercise {
  ID: string
  "Nombre (ES)": string
  "Zona principal": string
  "Músculos secundarios": string
  "Detalle/Descripción"?: string
  Imagen: string
  "Nivel de dificultad"?: string
  Tips?: string
}

const Img = styled('img')({
  width: '100%',
  height: 200,
  objectFit: 'cover',
})

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filtered, setFiltered] = useState<Exercise[]>([])
  const [zones, setZones] = useState<string[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [selectedDiffs, setSelectedDiffs] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
    const url = `${API_BASE}/exercises`

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('error')
        return r.json()
      })
      .then((data: Exercise[]) => {
        hydrateExerciseState(data)
      })
      .catch(() => {
        hydrateExerciseState(localExercises as Exercise[])
        setError('No pudimos conectar con el servidor. Mostrando ejercicios locales.')
      })
      .finally(() => setLoading(false))
  }, [])

  function hydrateExerciseState(data: Exercise[]) {
    setExercises(data)
    setFiltered(data)
    setZones(Array.from(new Set(data.map(d => d['Zona principal'])) as Set<string>))
    setDifficulties(Array.from(new Set(data.map(d => d['Nivel de dificultad']).filter(Boolean)) as Set<string>))
  }

  useEffect(() => {
    let list = exercises
    if (selectedZones.length) list = list.filter(e => selectedZones.includes(e['Zona principal']))
    if (selectedDiffs.length) list = list.filter(e => selectedDiffs.includes(e['Nivel de dificultad'] || ''))
    if (search) list = list.filter(e => e['Nombre (ES)'].toLowerCase().includes(search.toLowerCase()))
    setFiltered(list)
  }, [search, selectedZones, selectedDiffs, exercises])

  if (loading) return <p>Cargando...</p>

  return (
    <div className="page-shell">
      {error && <div style={{ marginBottom: '1rem', color: '#b45309' }}>{error}</div>}
      <section className="panel">
        <TextField label="Buscar" variant="outlined" fullWidth value={search} onChange={e => setSearch(e.target.value)} sx={{ mb: 2 }} />
        <FormGroup row>
          {zones.map(z => (
            <FormControlLabel key={z} control={<Checkbox checked={selectedZones.includes(z)} onChange={(_, c) => {
              setSelectedZones(prev => c ? [...prev, z] : prev.filter(v => v !== z))
            }} />} label={z} />
          ))}
        </FormGroup>
        <FormGroup row>
          {difficulties.map(d => (
            <FormControlLabel key={d} control={<Checkbox checked={selectedDiffs.includes(d)} onChange={(_, c) => {
              setSelectedDiffs(prev => c ? [...prev, d] : prev.filter(v => v !== d))
            }} />} label={d} />
          ))}
        </FormGroup>
        {filtered.length === 0 && <p>No se encontraron ejercicios. Probá otro filtro o término de búsqueda.</p>}
        <div className="card-grid">
          {filtered.map(ex => (
            <div key={ex.ID} className="card" onClick={() => setDetail(ex)}>
              <ImageWithFallback src={ex.Imagen} alt={ex['Nombre (ES)']} />
              <h3>{highlightMatch(ex['Nombre (ES)'], search)}</h3>
              <p>{ex['Zona principal']}</p>
            </div>
          ))}
        </div>
        <Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
          {detail && (
            <>
              <DialogTitle>{detail['Nombre (ES)']}</DialogTitle>
              <DialogContent>
                <ImageWithFallback src={detail.Imagen} alt={detail['Nombre (ES)']} />
                <div className="flex gap-2 my-2">
                  <Chip label={detail['Zona principal']} />
                  {detail['Músculos secundarios'].split(',').map(m => (
                    <Chip key={m} label={m.trim()} />
                  ))}
                </div>
                <p>{detail['Detalle/Descripción'] || 'Descripción no disponible'}</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetail(null)}>Volver</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </section>
    </div>
  )
}

interface ImgProps { src: string; alt: string }
function ImageWithFallback({ src, alt }: ImgProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative', minHeight: 200 }}>
      {!loaded && <CircularProgress size={40} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-20px', ml: '-20px' }} />}
      <Img
        src={error ? '/vite.svg' : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  )
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text

  const normalizedQuery = query.trim().toLowerCase()
  const parts = text.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'ig'))

  return parts.map((part, index) =>
    part.toLowerCase() === normalizedQuery ? <u key={`${part}-${index}`}>{part}</u> : part
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
