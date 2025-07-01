import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface Workout {
  userId: string
  exercises: string[]
  notes?: string
}

export async function logWorkout(data: Workout) {
  await addDoc(collection(db, 'workouts'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}
