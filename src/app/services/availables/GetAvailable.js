import { Op } from 'sequelize'
import {
  startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter
} from 'date-fns'

import schedule from '../../utils/workHours'
import Appointment from '../../models/Appointment'

class GetAvalaible {
  async run({ provider_id, date }) {
    const appointments = await Appointment.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)]
        }
      }
    })

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = setSeconds(setMinutes(setHours(date, hour), minute), 0)

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: isAfter(value, new Date()) && !appointments.find(item => format(item.date, 'HH:mm') === time)
      }
    })

    return available
  }
}

export default new GetAvalaible()
