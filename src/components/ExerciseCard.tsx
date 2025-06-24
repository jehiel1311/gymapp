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

export default function ExerciseCard({ exercise, onSelect }: Props) {
  return (
    <button onClick={() => onSelect(exercise)} className={styles.card}>
      <img src={`/img/${exercise.id}.jpg`} alt={exercise.nombre} />
      <h3>{exercise.nombre}</h3>
      <small>{exercise.zonaPrincipal}</small>
    </button>
  );
}
