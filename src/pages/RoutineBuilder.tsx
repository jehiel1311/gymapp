import { useExercises } from "../context/ExerciseContext";

export default function RoutineBuilder() {
  const { selected } = useExercises();
  return (
    <main style={{ padding: "1rem" }}>
      <h2>Tu Rutina ({selected.length} ejercicios)</h2>
      {selected.length === 0 ? (
        <p>Elegí ejercicios en la Home.</p>
      ) : (
        <ol>
          {selected.map(e => (
            <li key={e.id}>{e.nombre}</li>
          ))}
        </ol>
      )}
    </main>
  );
}
