import { useParams, useNavigate } from "react-router-dom";
import data from "../data/exercises.json";
import { Exercise } from "../components/ExerciseCard";

export default function ExerciseDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const ex = data.find((e: Exercise) => e.id === id);

  if (!ex) return <p>No encontrado</p>;

  return (
    <article style={{ padding: "1rem" }}>
      <button onClick={() => nav(-1)} style={{ marginBottom: ".5rem" }}>
        ◄ Volver
      </button>
      <img src={`/img/${ex.id}.jpg`} alt={ex.nombre} />
      <h2 style={{ color: "var(--color-primary)" }}>{ex.nombre}</h2>
      <p>
        <strong>Zona principal:</strong> {ex.zonaPrincipal}
      </p>
      <p>{ex.detalle}</p>
    </article>
  );
}
