import multer from 'multer'
import { Router } from 'express'

import multerConfig from './config/multer'
import authMiddleware from './app/middlewares/auth'
import UserController from './app/controllers/UserController'
import UploadController from './app/controllers/UploadController'
import SessionController from './app/controllers/SessionController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)
routes.put('/users', UserController.update)

routes.get('/providers', ProviderController.index)

routes.post('/appointments', AppointmentController.store)

routes.post('/files', upload.single('file'), UploadController.store)

export default routes
