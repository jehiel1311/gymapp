import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useUser()

  if (!user) return <p>No hay datos de usuario.</p>

  const edad = Math.floor((Date.now() - new Date(user.fechaNacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  const imc = (user.pesoKg / ((user.alturaCm/100) **2)).toFixed(1)

  return (
    <div className="p-4 space-y-4">
      <section style={{ minHeight: '33vh' }} className="border-b">
        <h2 className="text-xl font-bold mb-2">Perfil</h2>
        <p>Nombre: {user.nombre}</p>
        <p>Edad: {edad}</p>
        <p>Nivel: {user.nivel}</p>
        <p>Actividad: {user.actividad}</p>
        <p>Objetivo: {user.objetivo}</p>
        <button
          onClick={() => navigate('/calendario')}
          className="mt-2 bg-gray-500 text-white px-4 py-2"
        >
          Ir a Calendario
        </button>
        <button
          onClick={() => navigate('/ejercicios')}
          className="ml-2 mt-2 bg-blue-600 text-white px-4 py-2"
        >
          Ver Ejercicios
        </button>
      </section>
      <section>
        <h2 className="text-xl font-bold">Estado Físico</h2>
        <p>Altura: {user.alturaCm} cm</p>
        <p>Peso: {user.pesoKg} kg</p>
        <p>IMC: {imc}</p>
        {/* Aquí iría un gráfico de evolución de peso */}
      </section>
      {user.equipo && (
        <section>
          <h2 className="text-xl font-bold">Equipo/Limitaciones</h2>
          <p>{user.equipo}</p>
        </section>
      )}
      {user.lesiones && (
        <section>
          <h2 className="text-xl font-bold">Lesiones</h2>
          <p>{user.lesiones}</p>
        </section>
      )}
      {user.medidas && (
        <section>
          <h2 className="text-xl font-bold">Medidas</h2>
          <p>Brazo: {user.medidas.brazoCm ?? '-'} cm</p>
          <p>Cintura: {user.medidas.cinturaCm ?? '-'} cm</p>
          <p>Cadera: {user.medidas.caderaCm ?? '-'} cm</p>
        </section>
      )}
      {user.notificaciones && (
        <section>
          <h2 className="text-xl font-bold">Notificaciones</h2>
          <p>Peso mensual: {user.notificaciones.pesoMensual ? 'Sí' : 'No'}</p>
          <p>Recordatorio diario: {user.notificaciones.diarioSesion ? 'Sí' : 'No'}</p>
        </section>
      )}
      <div className="space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2">Editar Perfil</button>
      </div>
    </div>
  )
}
