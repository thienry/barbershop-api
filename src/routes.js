import { Router } from 'express'

const routes = new Router()

routes.get('/health', (req, res) => {
  return res.json({ message: 'GoBarber API!' })
})

export default routes
