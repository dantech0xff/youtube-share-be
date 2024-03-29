import usersRouter from '~/routes/users.routes'
import {
  registerUserController,
  loginUserController,
  getMyProfileController,
  getUserProfileByIdController,
  followUserByIdController,
  unFollowUserByIdController,
  changePasswordController
} from '~/controllers/users.controller'

jest.mock('~/services/users.service', () => {
  return {
    userServices: {},
    registerUser: jest.fn(),
    signUserAccessToken: jest.fn(),
    findUserWithId: jest.fn(),
    unFollowUserById: jest.fn(),
    followUserById: jest.fn(),
    findUserByIdPassword: jest.fn(),
    updateUserPasswordById: jest.fn(),
    checkIsUserFollowedByFollowerId: jest.fn()
  }
})
import userServices from '~/services/users.service'
import { ApiResponseMessage } from '~/constants/Messages'
import { hashPassword } from '~/utils/cryptography'

describe('Users Controller', () => {
  describe('registerUserController', () => {
    it('should register a new user', async () => {
      const mockReq: any = {
        body: {
          email: 'testuser@test.global',
          password: 'testpassword'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const mockUser = (userServices.registerUser as jest.Mock).mockResolvedValue({
        user_id: 'abcid',
        email: 'testuser@test.global'
      })
      const token = (userServices.signUserAccessToken as jest.Mock).mockResolvedValue('accesstoken')
      const result = await registerUserController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user_id: 'abcid',
          email: 'testuser@test.global',
          access_token: 'accesstoken'
        },
        message: ApiResponseMessage.USER_REGISTERED
      })
    })
  })

  describe('loginUserController', () => {
    it('should login a user', async () => {
      const mockReq: any = {
        user: {
          email: 'testuser@gmail.dev',
          _id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const token = (userServices.signUserAccessToken as jest.Mock).mockResolvedValue('accesstoken')
      const result = await loginUserController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user_id: 'abcid',
          email: 'testuser@gmail.dev',
          access_token: 'accesstoken'
        },
        message: ApiResponseMessage.USER_LOGGINED
      })
    })
  })

  describe('getMyProfileController', () => {
    it('should get my profile', async () => {
      const mockReq: any = {
        tokenPayload: {
          user_id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const now = new Date().toISOString()
      const user = (userServices.findUserWithId as jest.Mock).mockResolvedValue({
        user_id: 'abcid',
        email: 'testemail@outlook.test',
        username: 'testuser',
        create_at: now,
        update_at: now
      })
      const result = await getMyProfileController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user_id: 'abcid',
          email: 'testemail@outlook.test',
          username: 'testuser',
          create_at: now,
          update_at: now,
          followable: 0
        },
        message: ApiResponseMessage.MY_PROFILE
      })
    })
  })

  describe('getUserProfileByIdController', () => {
    it('should get user profile by id', async () => {
      const mockReq: any = {
        params: {
          user_id: 'abcid'
        },
        tokenPayload: {
          user_id: 'defid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const now = new Date().toISOString()
      const user = (userServices.findUserWithId as jest.Mock).mockResolvedValue({
        user_id: 'abcid',
        email: 'myemail@live.dev'
      })
      const isFollowed = (userServices.checkIsUserFollowedByFollowerId as jest.Mock).mockResolvedValue(false)
      const result = await getUserProfileByIdController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user_id: 'abcid',
          email: 'myemail@live.dev',
          followable: 1
        },
        message: `User profile by id abcid`
      })
    })
  })
  describe('unFollowUserByIdController', () => {
    it('should unfollow a user by id', async () => {
      const mockReq: any = {
        body: {
          user_id: 'abcid'
        },
        tokenPayload: {
          user_id: 'defid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const unfollowResult = (userServices.unFollowUserById as jest.Mock).mockResolvedValue({
        follower_id: 'defid',
        user_id: 'abcid'
      })
      await unFollowUserByIdController(mockReq, mockRes, mockNext)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          follower_id: 'defid',
          user_id: 'abcid'
        },
        message: ApiResponseMessage.REQUEST_HANDLE_SUCCESSFULLY
      })
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })

    it('should user is not able to unfollow themself', async () => {
      const mockReq: any = {
        body: {
          user_id: 'abcid'
        },
        tokenPayload: {
          user_id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      await unFollowUserByIdController(mockReq, mockRes, mockNext)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {},
        message: ApiResponseMessage.CANNOT_UNFLLOW_YOURSELF
      })
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })
  })

  describe('followUserByIdController', () => {
    it('should follow a user by id', async () => {
      const mockReq: any = {
        body: {
          user_id: 'abcid'
        },
        tokenPayload: {
          user_id: 'defid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const followResult = (userServices.followUserById as jest.Mock).mockResolvedValue({
        follower_id: 'defid',
        user_id: 'abcid'
      })
      await followUserByIdController(mockReq, mockRes, mockNext)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          follower_id: 'defid',
          user_id: 'abcid'
        },
        message: ApiResponseMessage.REQUEST_HANDLE_SUCCESSFULLY
      })
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })

    it('should user is not able to follow themself', async () => {
      const mockReq: any = {
        body: {
          user_id: 'abcid'
        },
        tokenPayload: {
          user_id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      await followUserByIdController(mockReq, mockRes, mockNext)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {},
        message: ApiResponseMessage.CANNOT_FOLLOW_YOURSELF
      })
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })
  })

  describe('changePasswordController', () => {
    it('should change password', async () => {
      const mockReq: any = {
        tokenPayload: {
          user_id: 'abcid'
        },
        body: {
          old_password: 'oldpassword',
          new_password: 'newpassword'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const findUserByIdResult = (userServices.findUserByIdPassword as jest.Mock).mockResolvedValue({})
      const updatePasswordResult = (userServices.updateUserPasswordById as jest.Mock).mockResolvedValue({
        user_id: 'abcid',
        hashPassword: hashPassword('newpassword')
      })
      await changePasswordController(mockReq, mockRes, mockNext)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user_id: 'abcid',
          hashPassword: hashPassword('newpassword')
        },
        message: ApiResponseMessage.PASSWORD_CHANGED_SUCCESSFULLY
      })
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
  })
})
