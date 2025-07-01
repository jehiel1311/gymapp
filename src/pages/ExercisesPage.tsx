import { useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import SearchBar from "../components/SearchBar";
import { useExercises, Exercise } from "../context/ExerciseContext";

export default function ExercisesPage() {
  const { exercises } = useExercises();
  const [query, setQuery] = useState("");
  const filtered = exercises.filter((e: Exercise) =>
    e.nombre.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <main style={{ padding: "1rem" }}>
      <SearchBar onSearch={setQuery} />
      <section className="grid" style={{ marginTop: "1rem" }}>
        {filtered.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </section>
    </main>
  );
}
