import { Exercise, useExercises } from "../context/ExerciseContext";

import styles from "./ExerciseCard.module.css";
import { useState } from "react";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { toggle, selected } = useExercises();
  const [loaded, setLoaded] = useState(false);
  const isSel = selected.some(e => e.id === exercise.id);
  return (
    <button
      onClick={() => toggle(exercise.id)}
      className={`${styles.card} ${isSel ? styles.active : ""}`}
    >
      <div style={{ position: "relative" }}>
        {!loaded && <div className={styles.skeleton} />}
        <img
          src={`/img/${exercise.id}.jpg`}
          alt={exercise.nombre}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <h3>{exercise.nombre}</h3>
      <small>{exercise.zonaPrincipal}</small>
    </button>
  );
}
