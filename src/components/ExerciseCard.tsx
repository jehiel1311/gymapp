export interface Exercise {
  id: string;
  nombre: string;
  zonaPrincipal: string;
}

export type Props = {
  exercise: Exercise;
  onSelect: (e: Exercise) => void;
};

import styles from "./ExerciseCard.module.css";
import { useState } from "react";

export default function ExerciseCard({ exercise, onSelect }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button onClick={() => onSelect(exercise)} className={styles.card}>
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
