import { useState } from "react";
import { Link } from "react-router-dom";
import { useExercises } from "../context/ExerciseContext";
import ExerciseCard from "../components/ExerciseCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const { exercises } = useExercises();
  const [query, setQuery] = useState("");

  const filtered = exercises.filter(e =>
    e.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main style={{ padding: "1rem" }}>
      <SearchBar onSearch={setQuery} />
      <div className="grid" style={{ marginTop: "1rem" }}>
        {filtered.map(e => (
          <ExerciseCard key={e.id} exercise={e} />
        ))}
      </div>
      <Link to="/routine" style={{ display: "block", marginTop: "1.5rem" }}>
        Ver rutina
      </Link>
    </main>
  );
}
