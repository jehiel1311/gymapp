import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Step1 from './Step1'
import Step2 from './Step2'
import ProfilePage from '../Profile/ProfilePage'
import CalendarPage from '../Profile/CalendarPage'
import ExerciseList from '../Exercises/ExerciseList'

export default function OnboardingRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/ejercicios" element={<ExerciseList />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
