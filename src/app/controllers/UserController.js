import User from '../models/User'
import Cache from '../../lib/Cache'
import Upload from '../models/Upload'

class UserController {
  async store (req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } })

    if (userExists) { return res.status(400).json({ error: 'User already exists!' }) }

    const { id, name, email, provider } = await User.create(req.body)

    if (provider) { return Cache.invalidate('providers') }

    return res.json({ id, name, email, provider })
  }

  async update (req, res) {
    const { email, oldPassword } = req.body
    const user = await User.findByPk(req.userId)

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } })

      if (userExists) { return res.status(400).json({ error: 'User already exists!' }) }
    }

    const resultCheck = await user.checkPassword(oldPassword)

    if (oldPassword && !resultCheck) { return res.status(401).json({ error: 'Password doesn\'t match ' }) }

    await User.update(req.body)

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: Upload,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    })

    return res.json({ id, name, email, avatar })
  }
}

export default new UserController()
