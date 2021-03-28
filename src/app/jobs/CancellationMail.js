import { format, parseISO } from 'date-fns'
import pt from 'date-fns/locale/pt'

import Mail from '../../lib/Mail'

class CancellationMail {
  get key () {
    return 'CancellationMail'
  }

  async handle ({ data }) {
    const { appointment } = data
    const stringDate = "'dia' dd 'de' MMMM', as' H:mm 'h'"
    const formattedDate = format(parseISO(appointment.date), stringDate, { locale: pt })

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado!',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.provider.name,
        date: formattedDate
      }
    })
  }
}

export default new CancellationMail()
