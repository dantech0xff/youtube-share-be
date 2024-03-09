import { Router } from 'express'
import { HTTP_CODES } from '~/constants/HTTP_CODES'
import {
  changePasswordController,
  followUserByIdController,
  getMyProfileController,
  getUserProfileByIdController,
  loginUserController,
  registerUserController,
  unFollowUserByIdController
} from '~/controllers/users.controller'
import {
  userAccessTokenValidator,
  userChangePasswordValidator,
  userLoginValidator,
  userRegisterValidator
} from '~/middlewares/users.middlewares'
import { defaultRequestHandler } from '~/utils/defaultRequestHandler'

const usersRouter = Router()

/**
 * Description: Register a new user
 * Method: POST
 * Path: /users/register
 * Body: { email: string, password: string }
 * Return: { data : { user_id: string, email: string, access_token: string }, message: string }
 */
usersRouter.post('/register', userRegisterValidator, defaultRequestHandler(registerUserController))

/**
 * Description: Login user
 * Method: POST
 * Path: /users/login
 * Body: { email: string, password: string }
 * Return: 200 { data : { user_id: string, email: string, access_token: string }, message: string }
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
  // TODO: Implement logout later, now user want to logout? just delete their token from client side
  res.status(HTTP_CODES.OK).json({ message: 'User logged out successfully!' })
})

/**
 * Description: Get my profile
 * Method: GET
 * Path: /users/me
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { user_id: string, email: string, username: string, create_at: ISO8601, update_at: ISO8601 }, message: string }
 */
usersRouter.get('/me', userAccessTokenValidator, defaultRequestHandler(getMyProfileController))

/**
 * Description: Get user profile by id
 * Method: GET
 * Path: /users/:user_id
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { user_id: string, email: string, username: string, create_at: ISO8601, update_at: ISO8601 }, message: string }
 */
usersRouter.get('/:user_id', userAccessTokenValidator, defaultRequestHandler(getUserProfileByIdController))

/**
 * Description: Follow user
 * Method: POST
 * Path: /users/follow
 * Body: { user_id: string }
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { user_id: string, follower_id: string, message: string }, message: string }
 */
usersRouter.post('/follow', userAccessTokenValidator, defaultRequestHandler(followUserByIdController))

/**
 * Description: Unfollow user
 * Method: POST
 * Path: /users/unfollow
 * Body: { user_id: string }
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { user_id: string, follower_id: string, message: string }, message: string }
 */
usersRouter.post('/unfollow', userAccessTokenValidator, defaultRequestHandler(unFollowUserByIdController))

/**
 * Description: Change password
 * Method: POST
 * Path: /users/change-password
 * Body: { old_password: string, new_password: string, confirm_new_password: string}
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { user_id: string, email: string, access_token: string }, message: string }
 */
usersRouter.post(
  '/change-password',
  userAccessTokenValidator,
  userChangePasswordValidator,
  defaultRequestHandler(changePasswordController)
)

export default usersRouter
