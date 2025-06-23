import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

const step2Schema = z.object({
  equipo: z.string().optional(),
  lesiones: z.string().optional(),
  medidas: z.object({
    brazoCm: z.number().optional(),
    cinturaCm: z.number().optional(),
    caderaCm: z.number().optional()
  }).optional(),
  notificaciones: z.object({
    pesoMensual: z.boolean().optional(),
    diarioSesion: z.boolean().optional()
  }).optional()
})

type Step2Data = z.infer<typeof step2Schema>

export default function Step2() {
  const { register, handleSubmit } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange'
  })
  const navigate = useNavigate()
  const { setUserData, finalizeUser } = useUser()

  const onSubmit = async (data: Step2Data) => {
    setUserData({
      equipo: data.equipo,
      lesiones: data.lesiones,
      medidas: data.medidas,
      notificaciones: {
        pesoMensual: data.notificaciones?.pesoMensual ?? false,
        diarioSesion: data.notificaciones?.diarioSesion ?? false,
      },
    })
    await finalizeUser()
    navigate('/perfil')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label>Equipo/Limitaciones</label>
        <input className="block w-full" {...register('equipo')} />
      </div>
      <div>
        <label>Lesiones</label>
        <textarea className="block w-full" {...register('lesiones')} />
      </div>
      <fieldset>
        <legend>Medidas adicionales (cm)</legend>
        <div className="flex gap-2">
          <input placeholder="Brazo" type="number" {...register('medidas.brazoCm',{valueAsNumber:true})} className="w-20" />
          <input placeholder="Cintura" type="number" {...register('medidas.cinturaCm',{valueAsNumber:true})} className="w-20" />
          <input placeholder="Cadera" type="number" {...register('medidas.caderaCm',{valueAsNumber:true})} className="w-20" />
        </div>
      </fieldset>
      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('notificaciones.pesoMensual')} />
          Notificación peso mensual
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('notificaciones.diarioSesion')} />
          Recordatorio diario de sesión
        </label>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2">Finalizar</button>
    </form>
  )
}
