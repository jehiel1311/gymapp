export type DayOfWeek = 'L'|'M'|'X'|'J'|'V'|'S'|'D'

export interface User {
  id: string
  nombre: string
  email: string
  password: string
  fechaNacimiento: string
  alturaCm: number
  pesoKg: number
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado'
  actividad: 'Sedentaria' | 'Ligera' | 'Moderada' | 'Intensa'
  objetivo: 'Masa' | 'Definición' | 'Resistencia' | 'Mantenimiento'
  diasDisponibles: DayOfWeek[]
  equipo?: string
  lesiones?: string
  medidas?: {
    brazoCm?: number
    cinturaCm?: number
    caderaCm?: number
  }
  notificaciones?: {
    pesoMensual: boolean
    diarioSesion: boolean
  }
}
