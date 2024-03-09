import { checkSchema } from 'express-validator'
import { ApiResponseMessage, minPasswordLength } from '~/constants/Messages'
import { appEnvConfig } from '~/constants/envConfig'
import userServices from '~/services/users.service'
import { requestValidator } from '~/utils/RequestValidator'
import { hashPassword } from '~/utils/cryptography'
import { verifyToken } from '~/utils/jwt'

export const userRegisterValidator = requestValidator(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: ApiResponseMessage.INVALID_EMAIl
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExisted = await userServices.isEmailExisted(value)
          if (isExisted) {
            throw new Error(ApiResponseMessage.USER_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: ApiResponseMessage.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: ApiResponseMessage.PASSWORD_MUST_BE_STRING
      },
      isLength: {
        errorMessage: ApiResponseMessage.PASSWORD_MUST_BE_AT_LEASE_X_CHARS_LONG,
        options: { min: minPasswordLength }
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
        errorMessage: ApiResponseMessage.INVALID_EMAIl
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const hpw = hashPassword(req.body.password)

          const user = await userServices.findUser(value, hpw)
          if (user === null) {
            throw new Error(ApiResponseMessage.EMAIL_OR_PASSWORD_INCORRECT)
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: ApiResponseMessage.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: ApiResponseMessage.PASSWORD_MUST_BE_STRING
      }
    }
  })
)

export const userAccessTokenValidator = requestValidator(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: ApiResponseMessage.ACCESS_TOKEN_IS_REQUIRED
        },
        isString: {
          errorMessage: ApiResponseMessage.ACCESS_TOKEN_MUST_BE_A_STRING
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
        errorMessage: ApiResponseMessage.OLD_PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: ApiResponseMessage.OLD_PASSWORD_MUST_BE_STRING
      }
    },
    new_password: {
      notEmpty: {
        errorMessage: ApiResponseMessage.NEW_PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: ApiResponseMessage.NEW_PASSWORD_MUST_BE_STRING
      },
      isLength: {
        errorMessage: ApiResponseMessage.NEW_PASSWORD_MUST_BE_AT_LEAST_X_CHARS_LONG,
        options: { min: minPasswordLength }
      }
    },
    confirm_new_password: {
      notEmpty: {
        errorMessage: ApiResponseMessage.CONFIRM_NEW_PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: ApiResponseMessage.CONFIRM_NEW_PASSWORD_MUST_BE_STRING
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.new_password) {
            throw new Error(ApiResponseMessage.CONFIRM_NEW_PASSWORD_MUST_BE_SAME_AS_NEW_PASSWORD)
          }
          return true
        }
      }
    }
  })
)
