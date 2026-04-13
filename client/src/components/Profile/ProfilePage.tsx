import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  if (!user) return <p className="page-shell">No hay datos de usuario.</p>

  const birthDate = new Date(user.fechaNacimiento)
  const edad = Number.isNaN(birthDate.getTime())
    ? '-'
    : Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  const imc = (user.pesoKg / ((user.alturaCm / 100) ** 2)).toFixed(1)

  return (
    <div className="page-shell stack">
      <section className="panel">
        <h2 className="text-xl font-bold mb-2">Perfil</h2>
        <div className="form-grid">
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Edad:</strong> {edad}</p>
          <p><strong>Nivel:</strong> {user.nivel}</p>
          <p><strong>Actividad:</strong> {user.actividad}</p>
          <p><strong>Objetivo:</strong> {user.objetivo}</p>
          <p><strong>IMC:</strong> {imc}</p>
        </div>
        <div className="row" style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate('/calendario')} className="bg-gray-500 text-white px-4 py-2">Registro de actividad</button>
          <button onClick={() => navigate('/ejercicios')} className="bg-blue-600 text-white px-4 py-2">Ver Ejercicios</button>
          <button onClick={() => { logout(); navigate('/auth') }} className="bg-gray-500 text-white px-4 py-2">Cerrar sesión</button>
        </div>
      </section>

      <section className="panel">
        <h2 className="text-xl font-bold">Estado Físico</h2>
        <p>Altura: {user.alturaCm} cm</p>
        <p>Peso: {user.pesoKg} kg</p>
      </section>

      {user.equipo && (
        <section className="panel">
          <h2 className="text-xl font-bold">Equipo/Limitaciones</h2>
          <p>{user.equipo}</p>
        </section>
      )}
      {user.lesiones && (
        <section className="panel">
          <h2 className="text-xl font-bold">Lesiones</h2>
          <p>{user.lesiones}</p>
        </section>
      )}
      {user.medidas && (
        <section className="panel">
          <h2 className="text-xl font-bold">Medidas</h2>
          <p>Brazo: {user.medidas.brazoCm ?? '-'} cm</p>
          <p>Cintura: {user.medidas.cinturaCm ?? '-'} cm</p>
          <p>Cadera: {user.medidas.caderaCm ?? '-'} cm</p>
        </section>
      )}
    </div>
  )
}
