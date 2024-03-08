import { Router } from 'express'
import {
  getMyProfileController,
  getUserProfileByIdController,
  loginUserController,
  registerUserController
} from '~/controllers/users.controller'
import { userAccessTokenValidator, userLoginValidator, userRegisterValidator } from '~/middlewares/users.middlewares'
import { defaultRequestHandler } from '~/utils/defaultRequestHandler'

const usersRouter = Router()

/**
 * Description: Register a new user
 * Method: POST
 * Path: /users/register
 * Body: { username: string, email: string, password: string }
 * Return: { data : { user_id: string, email: string, accessToken: string }, message: string }
 */
usersRouter.post('/register', userRegisterValidator, defaultRequestHandler(registerUserController))

/**
 * Description: Login user
 * Method: POST
 * Path: /users/login
 * Body: { email: string, password: string }
 * Return: 200 { data : { user_id: string, email: string, accessToken: string }, message: string }
 */
usersRouter.post('/login', userLoginValidator, defaultRequestHandler(loginUserController))

/**
 * Description: Logout user
 * Method: POST
 * Path: /users/logout
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { success: true } message: string }
 */
usersRouter.post('/logout', userAccessTokenValidator, (req, res) => {
  res.status(200).json({ message: 'User logged out successfully!' })
})

/**
 * Description: Get my profile
 * Method: GET
 * Path: /users/me
 * Return: { data: { user_id: string, email: string, username: string, create_at: ISO8601, update_at: ISO8601 }, message: string }
 */
usersRouter.get('/me', userAccessTokenValidator, defaultRequestHandler(getMyProfileController))

/**
 * Description: Get user profile by id
 * Method: GET
 * Path: /users/:user_id
 * Return: { data: { user_id: string, email: string, username: string, create_at: ISO8601, update_at: ISO8601 }, message: string }
 */
usersRouter.get('/:user_id', userAccessTokenValidator, defaultRequestHandler(getUserProfileByIdController))

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
