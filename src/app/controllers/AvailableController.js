import { Op } from 'sequelize'
import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from 'date-fns'

import schedule from '../utils/workHours'
import Appointment from '../models/Appointment'

class AvailableController {
  async index(req, res) {
    const { date } = req.query

    if (!date)
      return res.status(400).json({ error: 'Invalid date!' })
    
    const searchDate = Number(date)
    const appointments = await Appointment.findAll({
      where: { 
        provider_id: req.params.provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    })

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0)

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: isAfter(value, new Date()) && !appointments.find(item => format(item.date, 'HH:mm') === time)
      }
    })

    return res.json(available)
  }
}

export default new AvailableController()
