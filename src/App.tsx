import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ExercisesPage from "./pages/ExercisesPage";
import HistoryPage from "./pages/HistoryPage";
import "./App.css";

export default function App() {
  return (
    <HashRouter basename="">
      <nav className="nav">
        <NavLink to="/ejercicios">Ejercicios</NavLink>
        <NavLink to="/historial">Historial</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/ejercicios" element={<ExercisesPage/>} />
        <Route path="/historial" element={<HistoryPage/>} />
      </Routes>
    </HashRouter>
  );
}
