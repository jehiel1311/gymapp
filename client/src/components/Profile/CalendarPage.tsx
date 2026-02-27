import { Link } from 'react-router-dom'

export default function CalendarPage() {
  return (
    <div className="page-shell">
      <section className="panel">
        <h1 className="text-xl font-bold mb-4">Calendario</h1>
        <p style={{ color: '#475569' }}>Próximamente vas a poder visualizar tus sesiones con recordatorios y progreso semanal.</p>
        <Link to="/perfil" className="text-blue-500">Volver al perfil</Link>
      </section>
    </div>
  )
}
