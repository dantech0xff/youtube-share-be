import { checkSchema } from 'express-validator'
import { ApiResponseMessage } from '~/constants/Messages'
import videoService from '~/services/videos.service'
import { requestValidator } from '~/utils/RequestValidator'

export const userShareVideoValidator = requestValidator(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: 'Title is required!'
        },
        isString: {
          errorMessage: 'Title must be a string!'
        }
      },
      description: {
        notEmpty: {
          errorMessage: 'Description is required!'
        },
        isString: {
          errorMessage: 'Description must be a string!'
        }
      },
      url: {
        notEmpty: {
          errorMessage: 'Video URL is required!'
        },
        isString: {
          errorMessage: 'Video URL must be a string!'
        },
        isURL: {
          errorMessage: 'Video URL must be a valid URL!'
        },
        custom: {
          options: async (value: string, { req }) => {
            const isExisted = await videoService.isVideoUrlExisted({ url: value, user_id: req.tokenPayload.user_id })
            if (isExisted) {
              throw new Error(`You're already shared this video before! Visit your profile to see the video!`)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const getVideoListValidator = requestValidator(
  checkSchema({
    startIndex: {
      optional: true,
      isInt: {
        errorMessage: ApiResponseMessage.START_INDEX_MUST_BE_A_NUMBER
      },
      custom: {
        options: (value) => {
          if (value < 0) {
            throw new Error(ApiResponseMessage.START_INDEX_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
          }
          return true
        }
      }
    },
    limit: {
      optional: true,
      isInt: {
        errorMessage: ApiResponseMessage.LIMIT_MUST_BE_A_NUMBER
      },
      custom: {
        options: (value) => {
          if (value < 0) {
            throw new Error(ApiResponseMessage.LIMIT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
          }
          return true
        }
      }
    }
  })
)
