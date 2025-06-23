import { Link } from 'react-router-dom'

export default function CalendarPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Calendario</h1>
      <p>Aquí se mostrará un calendario próximamente.</p>
      <Link to="/perfil" className="text-blue-500">Volver al perfil</Link>
    </div>
  )
}
