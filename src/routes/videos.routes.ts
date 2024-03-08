import { Router } from 'express'
import {
  getListVideoController,
  getListVideoOfUserController,
  getVideoInfoController,
  userDeleteVideoController,
  userDownVoteVideoController,
  userUpVoteVideoController,
  userUploadVideoController
} from '~/controllers/videos.controller'
import { userAccessTokenValidator } from '~/middlewares/users.middlewares'
import { userShareVideoValidator } from '~/middlewares/videos.middlewares'
import { defaultRequestHandler } from '~/utils/defaultRequestHandler'
const videosRouter = Router()

/**
 * Description: Get share a video
 * Method: POST
 * Path: /videos/share
 * Body: { url: string, title: string, description: string }
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { video_id: string } }
 */
videosRouter.post(
  '/share',
  userAccessTokenValidator,
  userShareVideoValidator,
  defaultRequestHandler(userUploadVideoController)
)

/**
 * Get Video details
 * Method: GET
 * Path: /videos/:video_id
 * Return: { data: { video_id: string, videoUrl: string, title: string,
 *              upvotes: number, downvotes: number,
 *              description: string, create_at: ISO8601, update_at: ISO8601 }, message: string }
 */
videosRouter.get('/:video_id', defaultRequestHandler(getVideoInfoController))

/**
 * Description: Get list of videos
 * Method: GET
 * Path: /videos
 * Query: { startIndex: number, limit: number }
 */
videosRouter.get('/', defaultRequestHandler(getListVideoController))

/**
 * Description: Get list of videos by user id
 * Method: GET
 * Path: /videos/user/:user_id
 * Query: { startIndex: number, limit: number }
 */
videosRouter.get('/user/:user_id', defaultRequestHandler(getListVideoOfUserController))

/**
 * Description: Up vote a video
 * Method: POST
 * Path: /videos/up-vote
 * Body: { video_id: string }
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { video_id: string, upvotes: number, downvotes: number } }
 */
videosRouter.post('/up-vote', userAccessTokenValidator, defaultRequestHandler(userUpVoteVideoController))

/**
 * Description: Down vote a video
 * Method: POST
 * Path: /videos/down-vote
 * Body: { video_id: string }
 * Headers: { Authorization: Bearer <accessToken> }
 * Return: { data: { video_id: string, upvotes: number, downvotes: number } }
 */
videosRouter.post('/down-vote', userAccessTokenValidator, defaultRequestHandler(userDownVoteVideoController))

/**
 * Description: Delete a video
 * Method: DELETE
 * Path: /videos/delete/:video_id
 * Headers: { Authorization: Bearer <accessToken> }
 * Body: { video_id: string }
 * Return: { data: { message: string } }
 */
videosRouter.delete('/delete', userAccessTokenValidator, defaultRequestHandler(userDeleteVideoController))

export default videosRouter
