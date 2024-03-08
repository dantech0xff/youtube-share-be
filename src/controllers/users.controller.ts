import { HTTP_CODES } from '~/constants/HTTP_CODES'
import userServices from '~/services/users.service'
import { signToken } from '~/utils/jwt'
export const registerUserController = async (req: any, res: any, next: any) => {
  const registerResult = await userServices.registerUser(req.body)
  const user_id = registerResult.user_id
  const email = registerResult.email
  const accessToken = await userServices.signUserAccessToken(user_id.toString())
  const data = { user_id, email, accessToken }
  return res.status(HTTP_CODES.CREATED).json({ data, message: `User registered successfully!` })
}

export const loginUserController = async (req: any, res: any, next: any) => {
  const email = req.user.email
  const user_id = req.user._id
  const accessToken = await userServices.signUserAccessToken(user_id.toString())
  const data = { user_id, email, accessToken }
  return res.status(HTTP_CODES.OK).json({ data, message: `User logged in successfully!` })
}

export const getMyProfileController = async (req: any, res: any, next: any) => {
  const tokenPayload = req.tokenPayload
  tokenPayload.user_id
  const data = await userServices.findUserWithId(tokenPayload.user_id.toString())
  return res.status(HTTP_CODES.OK).json({ data, message: 'My Profile' })
}

export const getUserProfileByIdController = async (req: any, res: any, next: any) => {
  const data = await userServices.findUserWithId(req.params.user_id)
  return res.status(HTTP_CODES.OK).json({ data, message: `User profile by id ${req.params.user_id}` })
}
