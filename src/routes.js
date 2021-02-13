import multer from 'multer'
import { Router } from 'express'

import multerConfig from './config/multer'
import authMiddleware from './app/middlewares/auth'
import UserController from './app/controllers/UserController'
import UploadController from './app/controllers/UploadController'
import SessionController from './app/controllers/SessionController'
import ProviderController from './app/controllers/ProviderController'
import ScheduleController from './app/controllers/ScheduleController'
import AppointmentController from './app/controllers/AppointmentController'
import NotificationController from './app/controllers/NotificationController'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)
   
routes.use(authMiddleware)
routes.put('/users', UserController.update)

routes.get('/providers', ProviderController.index)

routes.get('/appointments', AppointmentController.index)
routes.post('/appointments', AppointmentController.store)
routes.delete('/appointments', AppointmentController.delete)

routes.get('schedule', ScheduleController.index)

routes.get('notifications', NotificationController.index)
routes.put('notifications/:id', NotificationController.update)

routes.post('/files', upload.single('file'), UploadController.store)

export default routes
