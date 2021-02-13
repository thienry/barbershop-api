import jwt from 'jsonwebtoken'
import User from '../models/User'

class SessionControler {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ error: 'User not found' })

    const resultCheck = await user.checkPassword(password)
    if (!resultCheck) return res.status(401).json({ error: 'Password doesn\'t match ' })

    const { id, name } = user
    const session = res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, process.env.SECRET, {
        expiresIn: process.env.EXPIRESIN
      })
    })

    return session
  }
}

export default new SessionControler()
