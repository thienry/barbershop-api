import User from '../models/User'
import Cache from '../../lib/Cache'
import Upload from '../models/Upload'
import Appointment from '../models/Appointment'

import CreateAppointment from '../services/appointments/CreateAppointment'
import DeleteAppointment from '../services/appointments/DeleteAppointment'

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query

    const cacheKey = `user:${req.userId}:appointments:${page}`

    const cached = await Cache.get(cacheKey)
    if (cached)
      return res.json(cached)

    const appointments = Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: Upload,
              as: 'avatar',
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    })

    await Cache.set(cacheKey, appointments)

    return res.json(appointments)
  }

  async store(req, res) {
    const { provider_id, date } = req.body

    const appointment = await CreateAppointment.run({
      provider_id,
      user_id: req.userId,
      date
    })

    return res.json(appointment)
  }
 
  async delete(req, res) {
    const appointment = await DeleteAppointment.run({
      provider_id: req.params.id,
      user_id: req.userId
    })

    return res.json(appointment)
  }
}

export default new AppointmentController()
