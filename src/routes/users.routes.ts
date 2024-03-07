import { Router } from 'express'
import { registerUserController } from '~/controllers/users.controller'
import { userRegisterValidator } from '~/middlewares/users.middlewares'
import { defaultRequestHandler } from '~/utils/defaultRequestHandler'

const usersRouter = Router()

/**
 * Description: Register a new user
 * Method: POST
 * Path: /users/register
 * Body: { username: string, email: string, password: string }
 */
usersRouter.post('/register', userRegisterValidator, defaultRequestHandler(registerUserController))

usersRouter.post('/login', (req, res) => {
  res.status(200).json({ message: 'User logged in successfully' })
})

usersRouter.post('/logout', (req, res) => {
  res.status(200).json({ message: 'User logged out successfully' })
})

usersRouter.get('/me', (req, res) => {
  res.status(200).json({ message: 'My profile' })
})

usersRouter.get('/:user_id', (req, res) => {
  res.status(200).json({ message: `User profile by id ${req.params}` })
})

usersRouter.post('/follow', (req, res) => {
  res.status(200).json({ message: `User followed successfully ${req.body}` })
})

usersRouter.post('/unfollow', (req, res) => {
  res.status(200).json({ message: `User unfollow successfully ${req.body}` })
})

usersRouter.post('/change-password', (req, res) => {
  res.status(404).json({ message: `User change password successfully ${req.body}` })
})

export default usersRouter
