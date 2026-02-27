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
    const payload = {
      equipo: data.equipo,
      lesiones: data.lesiones,
      medidas: data.medidas,
      notificaciones: {
        pesoMensual: data.notificaciones?.pesoMensual ?? false,
        diarioSesion: data.notificaciones?.diarioSesion ?? false,
      },
    }

    setUserData(payload)
    await finalizeUser(payload)
    navigate('/perfil')
  }

  return (
    <div className="page-shell form-layout">
      <form onSubmit={handleSubmit(onSubmit)} className="panel stack">
        <h2 className="text-xl font-bold" style={{ margin: 0 }}>Últimos detalles</h2>
        <div>
          <label className="label">Equipo / Limitaciones</label>
          <input {...register('equipo')} placeholder="Mancuernas, bandas, sin equipamiento..." />
        </div>
        <div>
          <label className="label">Lesiones</label>
          <textarea {...register('lesiones')} placeholder="Si hay alguna lesión o molestia, describila" />
        </div>
        <fieldset className="panel" style={{ background: '#f8faff' }}>
          <legend className="label">Medidas adicionales (cm)</legend>
          <div className="row">
            <input placeholder="Brazo" type="number" {...register('medidas.brazoCm', { valueAsNumber: true })} className="w-20" />
            <input placeholder="Cintura" type="number" {...register('medidas.cinturaCm', { valueAsNumber: true })} className="w-20" />
            <input placeholder="Cadera" type="number" {...register('medidas.caderaCm', { valueAsNumber: true })} className="w-20" />
          </div>
        </fieldset>
        <div className="stack" style={{ gap: '0.5rem' }}>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('notificaciones.pesoMensual')} style={{ width: 16 }} />
            Notificación peso mensual
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('notificaciones.diarioSesion')} style={{ width: 16 }} />
            Recordatorio diario de sesión
          </label>
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2" style={{ alignSelf: 'flex-end' }}>Finalizar</button>
      </form>
    </div>
  )
}
