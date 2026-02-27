import OnboardingRouter from './components/Onboarding/OnboardingRouter'
import { UserProvider } from './hooks/useUser'

function App() {
  return (
    <UserProvider>
      <OnboardingRouter />
    </UserProvider>
  )
}

export default App
