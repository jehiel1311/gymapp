import { useState } from 'react'
import './UserForm.css'

interface UserData {
  name: string
  age: string
  weight: string
  height: string
  goals: string
  activity: string
}

export default function UserForm() {
  const [data, setData] = useState<UserData>({
    name: '',
    age: '',
    weight: '',
    height: '',
    goals: '',
    activity: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('User data:', data)
    alert('Datos guardados en consola')
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input name="name" value={data.name} onChange={handleChange} required />
      </label>
      <label>
        Edad
        <input name="age" type="number" value={data.age} onChange={handleChange} required />
      </label>
      <label>
        Peso (kg)
        <input name="weight" type="number" value={data.weight} onChange={handleChange} required />
      </label>
      <label>
        Altura (cm)
        <input name="height" type="number" value={data.height} onChange={handleChange} required />
      </label>
      <label>
        Objetivos
        <textarea name="goals" value={data.goals} onChange={handleChange} />
      </label>
      <label>
        Actividad física
        <textarea name="activity" value={data.activity} onChange={handleChange} />
      </label>
      <button type="submit">Guardar</button>
    </form>
  )
}
