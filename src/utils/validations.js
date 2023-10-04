import { body } from 'express-validator'

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({
    min: 5,
  }),
]

export const registerValidation = [
  body('name', 'Укажите имя больше 3 символов').isLength({ min: 3 }),
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({
    min: 5,
  }),
]
