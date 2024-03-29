import { HTTP_CODES } from '~/constants/HTTP_CODES'
import { ApiResponseMessage } from '~/constants/Messages'
import { InteractionActionType } from '~/models/db-schemas/Interaction.schema'
import Video from '~/models/db-schemas/Video.schema'
import videoService from '~/services/videos.service'
import socketService from '~/socket/SocketService'

export const userUploadVideoController = async (req: any, res: any, next: any) => {
  const user_id = req.tokenPayload.user_id
  const { url, title, description } = req.body
  const data = await videoService.uploadVideo({
    user_id,
    url,
    title,
    description
  })
  socketService.notifyNewVideoSharedByUserId({ data: new Video(data) })
  return res.status(HTTP_CODES.CREATED).json({ data, message: ApiResponseMessage.VIDEO_SHARED })
}

export const getVideoInfoController = async (req: any, res: any, next: any) => {
  const [videoData, interactionData] = await Promise.all([
    videoService.getVideoInfo(req.params.video_id),
    videoService.getVideoInteraction(req.params.video_id)
  ])
  const data = { ...videoData, ...interactionData }
  return res.status(HTTP_CODES.OK).json({ data, message: `Video info by id ${req.params.video_id}` })
}

export const getListVideoController = async (req: any, res: any, next: any) => {
  // Temporarily solution for infinite scroll / pagination
  // not really efficient for large dataset or realtime update
  const startIndex = parseInt(req.query.startIndex as string) || 0
  const limit = parseInt(req.query.limit as string) || 10
  const videos = await videoService.getListVideos({ startIndex, limit })
  const nextIndex = startIndex + videos.length
  const total = await videoService.getTotalVideosCount()
  const data = { videos, nextIndex, total }
  return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.LIST_OF_VIDEOS })
}

export const getListVideoOfUserController = async (req: any, res: any, next: any) => {
  // Temporarily solution for infinite scroll / pagination
  // not really efficient for large dataset or realtime update
  const user_id = req.params.user_id
  const startIndex = parseInt(req.query.startIndex as string) || 0
  const limit = parseInt(req.query.limit as string) || 10
  const [videos, total] = await Promise.all([
    videoService.getVideosOfUser({ user_id, startIndex, limit }),
    videoService.getVideosOfUserCount(user_id)
  ])
  const nextIndex = startIndex + videos.length
  const data = { videos, nextIndex, total }
  return res.status(HTTP_CODES.OK).json({ data, message: `List of videos by user id ${user_id}` })
}

export const userUpVoteVideoController = async (req: any, res: any, next: any) => {
  const user_id = req.tokenPayload.user_id
  const video_id = req.body.video_id
  const data = await videoService.interactWithVideo({ user_id, video_id, action: InteractionActionType.UP_VOTE })
  return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.HANDLE_VIDEO_UP_VOTE_SUCCESSFULLY })
}

export const userDownVoteVideoController = async (req: any, res: any, next: any) => {
  const user_id = req.tokenPayload.user_id
  const video_id = req.body.video_id
  const data = await videoService.interactWithVideo({ user_id, video_id, action: InteractionActionType.DOWN_VOTE })
  return res.status(HTTP_CODES.OK).json({ data, message: ApiResponseMessage.HANDLE_VIDEO_DOWN_VOTE_SUCCESSFULLY })
}

export const userDeleteVideoController = async (req: any, res: any, next: any) => {
  const user_id = req.tokenPayload.user_id
  const video_id = req.body.video_id
  const data = await videoService.deleteVideo({ user_id, video_id })
  return res.status(HTTP_CODES.OK).json({ data })
}
