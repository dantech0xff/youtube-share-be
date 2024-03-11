import { userChangePasswordValidator, userRegisterValidator } from '~/middlewares/users.middlewares'
import userServices from '~/services/users.service'

jest.mock('~/services/users.service', () => {
  return {
    userServices: {},
    isEmailExisted: jest.fn(),
    findUser: jest.fn()
  }
})
describe('userRegisterValidator', () => {
  it('should call next if all fields are valid', async () => {
    const mockReq: any = {
      body: {
        email: 'helloworld@gmail.com',
        password: 'password'
      }
    }
    const mockRes: any = {}
    const mockNext: any = jest.fn()
    const emailResult = (userServices.isEmailExisted as jest.Mock).mockResolvedValue(false)
    await userRegisterValidator(mockReq, mockRes, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })
})

describe('userRegisterValidator', () => {
  it('should call next if all fields are valid', async () => {
    const mockReq: any = {
      body: {
        email: 'hello@gmail.com',
        password: 'password'
      }
    }
    const mockRes: any = {}
    const mockNext: any = jest.fn()
    const emailResult = (userServices.findUser as jest.Mock).mockResolvedValue({
      email: 'hello@gmail.com'
    })
    await userRegisterValidator(mockReq, mockRes, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })
})

describe('userChangePasswordValidator', () => {
  it('should call next if all fields are valid', async () => {
    const mockReq: any = {
      body: {
        old_password: 'oldpassword',
        new_password: 'newpassword',
        confirm_new_password: 'newpassword'
      }
    }
    const mockRes: any = {}
    const mockNext: any = jest.fn()
    await userChangePasswordValidator(mockReq, mockRes, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })
})
