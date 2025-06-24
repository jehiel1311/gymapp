import { useParams } from "react-router-dom";

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Detalle del ejercicio</h2>
      <p>ID: {id}</p>
    </div>
  );
}
