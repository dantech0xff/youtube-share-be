import { checkSchema } from 'express-validator'
import { appEnvConfig } from '~/constants/envConfig'
import userServices from '~/services/users.service'
import { requestValidator } from '~/utils/RequestValidator'
import { hashPassword } from '~/utils/cryptography'
import { verifyToken } from '~/utils/jwt'
export const userRegisterValidator = requestValidator(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: 'Invalid email!'
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExisted = await userServices.isEmailExisted(value)
          if (isExisted) {
            throw new Error('Email already existed!')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: 'Password is required!'
      },
      isString: {
        errorMessage: 'Password must be a string!'
      },
      isLength: {
        errorMessage: 'Password must be at least 6 chars long!',
        options: { min: 6 }
      }
      //   isStrongPassword: {
      //     errorMessage: 'Password must be strong!'
      //   }
    }
  })
)

export const userLoginValidator = requestValidator(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: 'Invalid email!'
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const hpw = hashPassword(req.body.password)

          const user = await userServices.findUser(value, hpw)
          if (user === null) {
            throw new Error('Email does not exist!')
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: 'Password is required!'
      },
      isString: {
        errorMessage: 'Password must be a string!'
      }
    }
  })
)

export const userAccessTokenValidator = requestValidator(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: 'Access token is required!'
        },
        isString: {
          errorMessage: 'Access token must be a string!'
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            const decoded_token = await verifyToken({
              token: access_token,
              secretOrPublicKey: appEnvConfig.jwtAccessSecret
            })
            req.tokenPayload = decoded_token
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const userChangePasswordValidator = requestValidator(
  checkSchema({
    old_password: {
      notEmpty: {
        errorMessage: 'Old password is required!'
      },
      isString: {
        errorMessage: 'Old password must be a string!'
      }
    },
    new_password: {
      notEmpty: {
        errorMessage: 'New password is required!'
      },
      isString: {
        errorMessage: 'New password must be a string!'
      },
      isLength: {
        errorMessage: 'New password must be at least 6 chars long!',
        options: { min: 6 }
      }
    },
    confirm_new_password: {
      notEmpty: {
        errorMessage: 'Confirm new password is required!'
      },
      isString: {
        errorMessage: 'Confirm new password must be a string!'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.new_password) {
            throw new Error('Confirm new password does not match new password!')
          }
          return true
        }
      }
    }
  })
)
