import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ExercisesPage from "./pages/ExercisesPage";
import HistoryPage from "./pages/HistoryPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter basename="/gymapp">
      <nav className="nav">
        <NavLink to="/" end>Ejercicios</NavLink>
        <NavLink to="/historial">Historial</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<ExercisesPage/>} />
        <Route path="/historial" element={<HistoryPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
