import pt from 'date-fns/locale/pt'
import { startOfHour, parseISO, isBefore, format } from 'date-fns'

import User from '../../models/User'
import Cache from '../../../lib/Cache'
import Appointment from '../../models/Appointment'
import Notification from '../../schemas/Notification'

class CreateAppointment {
  async run({ provider_id, user_id, date, cacheKey }) {
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    })

    if (!isProvider)
      throw new Error('You can only create appointments with providers!')

    const hourStart = startOfHour(parseISO(date))
    const isReallyBefore = isBefore(hourStart, new Date())

    if (isReallyBefore)
      throw new Error('Past dates are not allowed!')

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id, canceled_at: null, date: hourStart
      }
    })

    if (checkAvailability)
      throw new Error('Appointment date is not available!')

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date
    })

    const user = await User.findByPk(user_id)

    const stringDate = "'dia' dd 'de' MMMM', as' H:mm 'h'"
    const formattedDate = format(hourStart, stringDate, { locale: pt })

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id
    })

    await Cache.invalidatePrefix(`user:${user_id}:appointments:`)

    return appointment
  }
}

export default new CreateAppointment()
