import { createContext, useContext, useState, ReactNode } from "react";
import data from "../data/exercises.json";

export type Exercise = typeof data[number];

export type Ctx = {
  exercises: Exercise[];
  selected: Exercise[];
  toggle: (id: string) => void;
};

const ExerciseContext = createContext<Ctx>(null!);

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [selected, setSel] = useState<Exercise[]>([]);
  const toggle = (id: string) =>
    setSel(s =>
      s.some(e => e.id === id)
        ? s.filter(e => e.id !== id)
        : [...s, data.find(e => e.id === id)!]
    );

  return (
    <ExerciseContext.Provider value={{ exercises: data, selected, toggle }}>
      {children}
    </ExerciseContext.Provider>
  );
}

export const useExercises = () => useContext(ExerciseContext);
