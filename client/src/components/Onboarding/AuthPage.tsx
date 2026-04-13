import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register, login } = useUser()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completá email y contraseña.')
      return
    }

    if (mode === 'register') {
      if (!nombre.trim()) {
        setError('Completá tu nombre para registrarte.')
        return
      }
      const result = await register({ nombre: nombre.trim(), email, password })
      navigate(result.hasProfile ? '/perfil' : '/step1')
      return
    }

    const result = await login({ email, password })
    if (!result.success) {
      setError('Credenciales inválidas. Revisá email y contraseña.')
      return
    }

    navigate(result.hasProfile ? '/perfil' : '/step1')
  }

  return (
    <div className="page-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <section className="panel" style={{ width: '100%', maxWidth: 520 }}>
        <h1 style={{ marginTop: 0 }}>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
        <p style={{ color: '#475569' }}>
          Guardamos tu usuario para que no tengas que cargar todo cada vez.
        </p>

        <form onSubmit={handleSubmit} className="stack">
          {mode === 'register' && (
            <label>
              <span className="label">Nombre</span>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
          )}

          <label>
            <span className="label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            <span className="label">Contraseña</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          {error && <p className="error-text" style={{ margin: 0 }}>{error}</p>}

          <button type="submit">{mode === 'login' ? 'Entrar' : 'Registrarme'}</button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError('')
            setMode((prev) => (prev === 'login' ? 'register' : 'login'))
          }}
          className="bg-gray-500"
          style={{ marginTop: '0.75rem' }}
        >
          {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
        </button>
      </section>
    </div>
  )
}
