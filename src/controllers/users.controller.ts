import { HTTP_CODES } from '~/constants/HTTP_CODES'
import userServices from '~/services/users.service'

export const registerUserController = async (req: any, res: any, next: any) => {
  const result = await userServices.registerUser(req.body)
  return res.status(HTTP_CODES.CREATED).json({ result, message: `User registered successfully !` })
}
