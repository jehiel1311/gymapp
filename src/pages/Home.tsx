import { useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { Exercise, useExercises } from "../context/ExerciseContext";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const { exercises } = useExercises();
  const [query, setQuery] = useState("");
  const filtered = exercises.filter((e: Exercise) =>
    e.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main style={{ padding: "1rem" }}>
      <SearchBar onSearch={setQuery} />
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {filtered.map((ex: Exercise) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
          />
        ))}
      </section>
    </main>
  );
}
