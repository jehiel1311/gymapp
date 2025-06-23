import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

const step1Schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  fechaNacimiento: z.string(),
  alturaCm: z.number({ invalid_type_error: 'Número' }).min(30).max(300),
  pesoKg: z.number({ invalid_type_error: 'Número' }).min(20).max(500),
  nivel: z.enum(['Principiante', 'Intermedio', 'Avanzado']),
  actividad: z.enum(['Sedentaria', 'Ligera', 'Moderada', 'Intensa']),
  objetivo: z.enum(['Masa', 'Definición', 'Resistencia', 'Mantenimiento']),
  diasDisponibles: z.array(z.enum(['L','M','X','J','V','S','D'])).min(1)
})

type Step1Data = z.infer<typeof step1Schema>

export default function Step1() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange'
  })
  const navigate = useNavigate()
  const { setUserData } = useUser()

  const onSubmit = (data: Step1Data) => {
    setUserData(data)
    navigate('/step2')
  }

  const days = ['L','M','X','J','V','S','D'] as const

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label>Nombre</label>
        <input className="block w-full" {...register('nombre')} />
        {errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}
      </div>
      <div>
        <label>Email</label>
        <input className="block w-full" type="email" {...register('email')} />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>
      <div>
        <label>Contraseña</label>
        <input className="block w-full" type="password" {...register('password')} />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </div>
      <div>
        <label>Fecha de nacimiento</label>
        <input className="block w-full" type="date" {...register('fechaNacimiento')} />
      </div>
      <div>
        <label>Altura (cm)</label>
        <input className="block w-full" type="number" {...register('alturaCm',{valueAsNumber:true})} />
        {errors.alturaCm && <span className="text-red-500">{errors.alturaCm.message}</span>}
      </div>
      <div>
        <label>Peso (kg)</label>
        <input className="block w-full" type="number" {...register('pesoKg',{valueAsNumber:true})} />
        {errors.pesoKg && <span className="text-red-500">{errors.pesoKg.message}</span>}
      </div>
      <div>
        <label>Nivel</label>
        <select className="block w-full" {...register('nivel')}>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>
      <div>
        <label>Actividad física</label>
        <select className="block w-full" {...register('actividad')}>
          <option value="Sedentaria">Sedentaria</option>
          <option value="Ligera">Ligera</option>
          <option value="Moderada">Moderada</option>
          <option value="Intensa">Intensa</option>
        </select>
      </div>
      <div>
        <label>Objetivo</label>
        <select className="block w-full" {...register('objetivo')}>
          <option value="Masa">Masa</option>
          <option value="Definición">Definición</option>
          <option value="Resistencia">Resistencia</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
      </div>
      <div>
        <label>Días disponibles</label>
        <div className="flex gap-2">
          {days.map(d => (
            <label key={d} className="flex flex-col items-center">
              <input type="checkbox" value={d} {...register('diasDisponibles')} />
              <span>{d}</span>
            </label>
          ))}
        </div>
        {errors.diasDisponibles && <span className="text-red-500">Seleccione al menos uno</span>}
      </div>
      <button type="submit" disabled={!isValid} className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50">
        Siguiente
      </button>
    </form>
  )
}
