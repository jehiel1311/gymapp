import OnboardingRouter from './components/Onboarding/OnboardingRouter'
import { UserProvider } from './hooks/useUser'
import './App.css'

export default function App() {
  return (
    <UserProvider>
      <OnboardingRouter />
    </UserProvider>
  )
}
