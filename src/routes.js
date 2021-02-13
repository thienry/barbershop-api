import multer from 'multer'
import { Router } from 'express'

import multerConfig from './config/multer'
import authMiddleware from './app/middlewares/auth'

// Controllers
import UserController from './app/controllers/UserController'
import UploadController from './app/controllers/UploadController'
import SessionController from './app/controllers/SessionController'
import ProviderController from './app/controllers/ProviderController'
import ScheduleController from './app/controllers/ScheduleController'
import AvailableController from './app/controllers/AvailableController'
import AppointmentController from './app/controllers/AppointmentController'
import NotificationController from './app/controllers/NotificationController'

// Validators
import { sessionStore } from './app/validators/SessionValidation'
import { userStore, userUpdate } from './app/validators/UserValidation'
import { appointmentStore } from './app/validators/AppointmentValidation'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/users', userStore, UserController.store)
routes.post('/sessions', sessionStore, SessionController.store)
   
routes.use(authMiddleware)
routes.put('/users', userUpdate,  UserController.update)

routes.get('/providers', ProviderController.index)
routes.get('/providers/:providerId/available', AvailableController.index)

routes.get('/appointments', AppointmentController.index)
routes.post('/appointments', appointmentStore, AppointmentController.store)
routes.delete('/appointments/:id', AppointmentController.delete)

routes.get('schedule', ScheduleController.index)

routes.get('notifications', NotificationController.index)
routes.put('notifications/:id', NotificationController.update)

routes.post('/files', upload.single('file'), UploadController.store)

export default routes
