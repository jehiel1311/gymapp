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
      <header className="header">
        <span>GymApp</span>
        <button onClick={() => setDark(d => !d)}>
          Modo {dark ? 'claro' : 'oscuro'}
        </button>
      </header>
      <div className="main">
        <OnboardingRouter />
      </div>
      <footer className="footer">© 2024 GymApp</footer>
    </UserProvider>
  )
}
