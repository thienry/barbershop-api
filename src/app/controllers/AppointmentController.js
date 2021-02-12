import * as Yup from 'yup'
import pt from 'date-fns/locale/pt'
import { startOfHour, parseISO, isBefore, format } from 'date-fns'

import User from '../models/User'
import Upload from '../models/Upload'
import Appointment from '../models/Appointment'
import Notification from '../schemas/Notification'

class AppointmentController {
  async index() {
    const { page = 1 } = req.query

    const appointments = Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
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

    return res.json(appointments )
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required()
    })

    const isValidParams = await schema.isValid(req.body)
    if (!isValidParams) return res.status(400).json({ error: 'Validation fails!' })

    const { provider_id, date } = req.body

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    })

    if (!isProvider) return res.status(401).json({ error: 'You can only create appointments with providers' })

    const hourStart = startOfHour(parseISO(date))
    const isReallyBefore = isBefore(hourStart, new Date())

    if (isReallyBefore) return res.status(400).json({ error: 'Past dates are not allowed' })

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id, canceled_at: null, date: hourStart
      }
    })

    if (checkAvailability) return res.status(400).json({ error: 'Past dates are not allowed' })

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    })

    const user = await User.findByPk(req.userId)

    const stringDate = "'dia' dd 'de' MMMM', as' H:mm 'h'"
    const formattedDate = format(hourStart, stringDate, { locale: pt })

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id
    })

    return res.json(appointment)
  }
}

export default new AppointmentController()
