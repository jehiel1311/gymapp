import { useNavigate } from 'react-router-dom'
import { useUser } from './hooks/useUser'

function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useUser()

  const handleStart = () => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    navigate(user ? '/perfil' : '/step1')
  }

  return (
    <div className="page-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <section className="panel" style={{ width: '100%', maxWidth: 720, textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <p style={{ margin: 0, color: '#6d28d9', fontWeight: 700, letterSpacing: '0.08em' }}>ENTRENAPP</p>
        <h1 style={{ margin: '0.4rem 0', fontSize: '2.5rem' }}>Tu entrenamiento, versión 2026</h1>
        <p style={{ color: '#475569', margin: '0.75rem auto 2rem', maxWidth: 460 }}>
          Planes personalizados, seguimiento inteligente y una experiencia mucho más limpia para mantener tu progreso siempre visible.
        </p>
        <button onClick={handleStart}>
          {isAuthenticated ? 'Ir a mi cuenta' : 'Comenzar ahora'}
        </button>
      </section>
    </div>
  )
}

export default Landing
