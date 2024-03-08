import { HTTP_CODES } from '~/constants/HTTP_CODES'
import userServices from '~/services/users.service'
import { hashPassword } from '~/utils/cryptography'
import { signToken } from '~/utils/jwt'
export const registerUserController = async (req: any, res: any, next: any) => {
  const registerResult = await userServices.registerUser(req.body)
  const user_id = registerResult.user_id
  const email = registerResult.email
  const access_token = await userServices.signUserAccessToken(user_id.toString())
  const data = { user_id, email, access_token }
  return res.status(HTTP_CODES.CREATED).json({ data, message: `User registered successfully!` })
}

export const loginUserController = async (req: any, res: any, next: any) => {
  const email = req.user.email
  const user_id = req.user._id
  const access_token = await userServices.signUserAccessToken(user_id.toString())
  const data = { user_id, email, access_token }
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

export const followUserByIdController = async (req: any, res: any, next: any) => {
  const user_id = req.body.user_id
  const follower_id = req.tokenPayload.user_id
  console.log('user_id', user_id)
  console.log('follower_id', follower_id)
  if (user_id === follower_id) {
    const data = {}
    return res.status(HTTP_CODES.BAD_REQUEST).json({ data, message: `Can't follow yourself!` })
  } else {
    const data = await userServices.followUserById({ follower_id, user_id })
    return res.status(HTTP_CODES.OK).json({ data, message: `Request handled successfully` })
  }
}

export const unFollowUserByIdController = async (req: any, res: any, next: any) => {
  const user_id = req.body.user_id
  const follower_id = req.tokenPayload.user_id
  console.log('user_id', user_id)
  console.log('follower_id', follower_id)
  if (user_id === follower_id) {
    const data = {}
    return res.status(HTTP_CODES.BAD_REQUEST).json({ data, message: `Can't unfollow yourself!` })
  } else {
    const data = await userServices.unFollowUserById({ follower_id, user_id })
    return res.status(HTTP_CODES.OK).json({ data, message: `Request handled successfully` })
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
    const data = { message: `Your provided information is incorrect!` }
    return res.status(HTTP_CODES.BAD_REQUEST).json({ data })
  } else {
    const data = await userServices.updateUserPasswordById({
      user_id,
      hashPassword: hashPassword(req.body.new_password)
    })
    return res.status(HTTP_CODES.OK).json({ data, message: `User change password successfully` })
  }
}
