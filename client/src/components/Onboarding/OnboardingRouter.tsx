import type { ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Landing from '../../Landing'
import { useUser } from '../../hooks/useUser'
import ExerciseList from '../Exercises/ExerciseList'
import CalendarPage from '../Profile/CalendarPage'
import ProfilePage from '../Profile/ProfilePage'
import AuthPage from './AuthPage'
import Step1 from './Step1'
import Step2 from './Step2'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useUser()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default function OnboardingRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/step1" element={<ProtectedRoute><Step1 /></ProtectedRoute>} />
        <Route path="/step2" element={<ProtectedRoute><Step2 /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/ejercicios" element={<ProtectedRoute><ExerciseList /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
