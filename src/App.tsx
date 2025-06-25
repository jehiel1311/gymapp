import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import ExerciseDetail from "./pages/ExerciseDetail";
import RoutineBuilder from "./pages/RoutineBuilder";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/rutina" element={<RoutineBuilder />} />
      </Routes>
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          padding: ".5rem 0",
          background: "#fff",
          boxShadow: "0 -1px 4px rgba(0,0,0,.1)",
        }}
      >
        <NavLink to="/">🏠 Inicio</NavLink>
        <NavLink to="/rutina">📋 Rutina</NavLink>
      </footer>
    </>
  );
}

export default App;
