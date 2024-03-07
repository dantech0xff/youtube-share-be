import { RegisterNewUserRequest } from '~/models/requests/User.requests'
import databaseService from './database.service'
import User from '~/models/db-schemas/User.schema'
import { hashPassword } from '~/utils/cryptography'

class UserService {
  async registerUser(registerNewUserRequest: RegisterNewUserRequest) {
    return await databaseService.users.insertOne(
      new User({
        ...registerNewUserRequest,
        email: registerNewUserRequest.email,
        password: hashPassword(registerNewUserRequest.password)
      })
    )
  }

  async isEmailExisted(email: string) {
    return Boolean(await databaseService.users.findOne({ email }))
  }
}

const userServices = new UserService()
export default userServices
