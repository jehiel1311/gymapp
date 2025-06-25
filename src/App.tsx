import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ExerciseDetail from "./pages/ExerciseDetail";
import RoutineBuilder from "./pages/RoutineBuilder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/exercise/:id" element={<ExerciseDetail />} />
      <Route path="/routine" element={<RoutineBuilder />} />
    </Routes>
  );
}

export default App;
