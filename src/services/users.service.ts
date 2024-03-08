import { RegisterNewUserRequest } from '~/models/requests/User.requests'
import databaseService from './database.service'
import User from '~/models/db-schemas/User.schema'
import { hashPassword } from '~/utils/cryptography'
import { signToken } from '~/utils/jwt'
import { appEnvConfig } from '~/constants/envConfig'
import { ObjectId } from 'mongodb'
import Follower from '~/models/db-schemas/Follower.schema'
class UserService {
  async registerUser(registerNewUserRequest: RegisterNewUserRequest) {
    const insertResult = await databaseService.users.insertOne(
      new User({
        ...registerNewUserRequest,
        email: registerNewUserRequest.email,
        password: hashPassword(registerNewUserRequest.password)
      })
    )
    const user_id = insertResult.insertedId
    const email = registerNewUserRequest.email
    return { user_id, email }
  }

  async isEmailExisted(email: string) {
    return Boolean(await databaseService.users.findOne({ email }))
  }

  async findUser(userEmail: string, hashPassword: string) {
    return await databaseService.users.findOne({ email: userEmail, password: hashPassword })
  }

  async findUserByIdPassword(input: { user_id: string; hashPassword: string }) {
    return await databaseService.users.findOne({ _id: new ObjectId(input.user_id), password: input.hashPassword })
  }

  async updateUserPasswordById(input: { user_id: string; hashPassword: string }) {
    const updateResult = await databaseService.users.updateOne(
      { _id: new ObjectId(input.user_id) },
      { $set: { password: input.hashPassword } }
    )
    if (updateResult.matchedCount === 0) throw new Error('User not found!')
    return { user_id: input.user_id }
  }

  async findUserWithId(user_id: string) {
    const findResult = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!findResult) throw new Error('User not found!')
    return {
      user_id: findResult._id,
      email: findResult.email,
      username: findResult.username,
      create_at: findResult.create_at,
      update_at: findResult.update_at
    }
  }

  signUserAccessToken(user_id: string) {
    return signToken({
      payload: { user_id },
      privateKey: appEnvConfig.jwtAccessSecret,
      options: {
        expiresIn: appEnvConfig.jwtAccessExpireIn
      }
    })
  }

  async followUserById(input: { follower_id: string; user_id: string }) {
    const followerOfUserId = await databaseService.followers.findOne({
      user_id: new ObjectId(input.user_id),
      follower_id: new ObjectId(input.follower_id)
    })
    let message = ''
    if (followerOfUserId) {
      message = 'User already followed!'
    } else {
      await databaseService.followers.insertOne(
        new Follower({
          user_id: new ObjectId(input.user_id),
          follower_id: new ObjectId(input.follower_id)
        })
      )
      message = 'Follow user successfully!'
    }
    return { user_id: input.user_id, follower_id: input.follower_id, message }
  }

  async unFollowUserById(input: { follower_id: string; user_id: string }) {
    const followerOfUserId = await databaseService.followers.findOne({
      user_id: new ObjectId(input.user_id),
      follower_id: new ObjectId(input.follower_id)
    })
    let message = ''
    if (followerOfUserId) {
      await databaseService.followers.deleteOne({
        user_id: new ObjectId(input.user_id),
        follower_id: new ObjectId(input.follower_id)
      })
      message = 'Unfollow user successfully!'
    } else {
      message = 'User not followed before!'
    }
    return { user_id: input.user_id, follower_id: input.follower_id, message }
  }
}

const userServices = new UserService()
export default userServices
