import { HTTP_CODES } from '~/constants/HTTP_CODES'
import { ApiResponseMessage } from '~/constants/Messages'
import userServices from '~/services/users.service'
import { hashPassword } from '~/utils/cryptography'

export const registerUserController = async (req: any, res: any, next: any) => {
  const registerResult = await userServices.registerUser(req.body)
  const user_id = registerResult.user_id
  const email = registerResult.email
  const access_token = await userServices.signUserAccessToken(user_id.toString())
  const data = { user_id, email, access_token }
  return res.status(HTTP_CODES.CREATED).json({ data, message: ApiResponseMessage.USER_REGISTERED })
}

export const loginUserController = async (req: any, res: any, next: any) => {
  const email = req.user.email
  const user_id = req.user._id
  const access_token = await userServices.signUserAccessToken(user_id.toString())
  const data = { user_id, email, access_token }
  return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.USER_LOGGINED })
}

export const getMyProfileController = async (req: any, res: any, next: any) => {
  const tokenPayload = req.tokenPayload
  tokenPayload.user_id
  const data = await userServices.findUserWithId(tokenPayload.user_id.toString())
  return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.MY_PROFILE })
}

export const getUserProfileByIdController = async (req: any, res: any, next: any) => {
  const data = await userServices.findUserWithId(req.params.user_id)
  return res.status(HTTP_CODES.OK).json({ data, message: `User profile by id ${req.params.user_id}` })
}

export const followUserByIdController = async (req: any, res: any, next: any) => {
  const user_id = req.body.user_id
  const follower_id = req.tokenPayload.user_id
  console.log('user_id', user_id)
  console.log('follower_id', follower_id)
  if (user_id === follower_id) {
    const data = {}
    return res.status(HTTP_CODES.BAD_REQUEST).json({ data, message: ApiResponseMessage.CANNOT_FOLLOW_YOURSELF })
  } else {
    const data = await userServices.followUserById({ follower_id, user_id })
    return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.REQUEST_HANDLE_SUCCESSFULLY })
  }
}

export const unFollowUserByIdController = async (req: any, res: any, next: any) => {
  const user_id = req.body.user_id
  const follower_id = req.tokenPayload.user_id
  console.log('user_id', user_id)
  console.log('follower_id', follower_id)
  if (user_id === follower_id) {
    const data = {}
    return res.status(HTTP_CODES.BAD_REQUEST).json({ data, message: ApiResponseMessage.CANNOT_UNFLLOW_YOURSELF })
  } else {
    const data = await userServices.unFollowUserById({ follower_id, user_id })
    return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.REQUEST_HANDLE_SUCCESSFULLY })
  }
}

export const changePasswordController = async (req: any, res: any, next: any) => {
  const user_id = req.tokenPayload.user_id
  console.log('user_id', user_id)

  const user = await userServices.findUserByIdPassword({
    user_id: user_id,
    hashPassword: hashPassword(req.body.old_password)
  })
  if (!user) {
    const data = { message: ApiResponseMessage.YOUR_PROVIDED_INFORMATION_IS_NOT_CORRECT }
    return res.status(HTTP_CODES.BAD_REQUEST).json({ data })
  } else {
    const data = await userServices.updateUserPasswordById({
      user_id,
      hashPassword: hashPassword(req.body.new_password)
    })
    return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.PASSWORD_CHANGED_SUCCESSFULLY })
  }
}
