import OnboardingRouter from './components/Onboarding/OnboardingRouter'
import { UserProvider } from './hooks/useUser'
import { useEffect, useState } from 'react'
import './App.css'

export default function App() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.body.className = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <UserProvider>
      <div style={{ position: 'fixed', top: 10, right: 10 }}>
        <button onClick={() => setDark(d => !d)}>
          Modo {dark ? 'claro' : 'oscuro'}
        </button>
      </div>
      <OnboardingRouter />
    </UserProvider>
  )
}
