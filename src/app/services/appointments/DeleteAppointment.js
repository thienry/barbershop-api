import { isBefore, subHours } from 'date-fns'

import Queue from '../../lib/Queue'
import User from '../../models/User'
import Appointment from '../../models/Appointment'
import CancellationMail from '../jobs/CancellationMail'

class DeleteAppointment {
  async run({ provider_id, user_id }) {
    const appointment = await Appointment.findByPk(provider_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    })

    if (appointment.user_id !== req.userId)
      throw new Error('You don\'t have permission to cancel this appointment!')

    const dateSub = subHours(appointment.date, 2)
    const isReallyBefore = isBefore(dateSub, new Date())

    if (isReallyBefore)
      throw new Error('You can only cancel appointments 2 hours in advance!')

    appointment.canceled_at = new Date()

    await appointment.save()
    await Queue.add(CancellationMail.key, { appointment })

    return appointment
  }
}

export default new DeleteAppointment()
