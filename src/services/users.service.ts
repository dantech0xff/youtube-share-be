import { RegisterNewUserRequest } from '~/models/requests/User.requests'
import databaseService from './database.service'
import User from '~/models/db-schemas/User.schema'
import { hashPassword } from '~/utils/cryptography'
import { signToken } from '~/utils/jwt'
import { appEnvConfig } from '~/constants/envConfig'
import { ObjectId } from 'mongodb'
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
}

const userServices = new UserService()
export default userServices
