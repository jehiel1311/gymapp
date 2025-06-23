import { useEffect, useState } from 'react'
import './App.css'

interface Exercise {
  ID: string
  "Nombre (ES)": string
  "Zona principal": string
  Imagen: string
}

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/exercises')
      .then(res => res.json())
      .then(data => {
        setExercises(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load exercises', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p>Loading exercises...</p>
  }

  return (
    <div className="container">
      <h1>Gym Exercises</h1>
      <div className="grid">
        {exercises.map(ex => (
          <div key={ex.ID} className="card">
            <img src={ex.Imagen} alt={ex["Nombre (ES)"]} />
            <h3>{ex["Nombre (ES)"]}</h3>
            <p>{ex["Zona principal"]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
