import { useState } from "react";
import data from "../data/exercises.json"; // temporal
import ExerciseCard, { Exercise } from "../components/ExerciseCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = data.filter((e: Exercise) =>
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
            onSelect={() => {
              /* navigate al detalle */
            }}
          />
        ))}
      </section>
    </main>
  );
}
