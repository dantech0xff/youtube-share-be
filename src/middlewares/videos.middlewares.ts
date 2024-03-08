import { checkSchema } from 'express-validator'
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
