import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'

import { checkAuth, handleValidationErrors } from './src/utils/index.js'
import { loginValidation, registerValidation } from './src/utils/validations.js'
import { UserController } from './src/controllers/index.js'
import { BoardController } from './src/controllers/index.js'
import { SectionController } from './src/controllers/index.js'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB - OK'))
  .catch((err) => console.log('DB - error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
)
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/boards', checkAuth, BoardController.create)
app.get('/boards', checkAuth, BoardController.getAll)
app.put('/boards', checkAuth, BoardController.updatePosition)
app.get('/boards/:id', checkAuth, BoardController.getOne)
app.put('/boards/:id', checkAuth, BoardController.update)
app.get('/favorites', checkAuth, BoardController.getFavorites)
app.put('/favorites', checkAuth, BoardController.updateFavoritesPosition)
app.delete('/boards/:id', checkAuth, BoardController.remove)

app.post('/boards/:boardId/sections', checkAuth, SectionController.create)
app.put(
  '/boards/:boardId/sections/:sectionId',
  checkAuth,
  SectionController.update
)
app.delete(
  '/boards/:boardId/sections/:sectionId',
  checkAuth,
  SectionController.remove
)

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('PORT:', process.env.PORT)
  console.log('Server - OK')
})
