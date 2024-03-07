import { checkSchema } from 'express-validator'
import userServices from '~/services/users.service'
import { requestValidator } from '~/utils/RequestValidator'

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