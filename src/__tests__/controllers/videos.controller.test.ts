jest.mock('~/services/videos.service', () => {
  return {
    videoService: {},
    shareVideo: jest.fn(),
    getVideoList: jest.fn(),
    uploadVideo: jest.fn(),
    getVideoInfo: jest.fn(),
    getVideoInteraction: jest.fn(),
    getListVideos: jest.fn(),
    getTotalVideosCount: jest.fn(),
    getVideosOfUser: jest.fn(),
    getVideosOfUserCount: jest.fn(),
    interactWithVideo: jest.fn(),
    deleteVideo: jest.fn()
  }
})
jest.mock('~/socket/SocketService', () => {
  return {
    notifyNewVideoSharedByUserId: jest.fn()
  }
})
import videoService from '~/services/videos.service'
import { ApiResponseMessage } from '~/constants/Messages'
import {
  getListVideoController,
  getListVideoOfUserController,
  getVideoInfoController,
  userDeleteVideoController,
  userUpVoteVideoController,
  userUploadVideoController
} from '~/controllers/videos.controller'
import socketService from '~/socket/SocketService'
import Video from '~/models/db-schemas/Video.schema'
import { ObjectId } from 'mongodb'

describe('Videos Controller', () => {
  describe('userUploadVideoController', () => {
    it('should upload a video success', async () => {
      const mockReq: any = {
        tokenPayload: {
          user_id: 'abcid'
        },
        body: {
          url: 'testurl',
          title: 'testtitle',
          description: 'testdescription'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const videoId = new ObjectId()
      const mockVideo = (videoService.uploadVideo as jest.Mock).mockResolvedValue({
        _id: videoId,
        user_id: 'abcid',
        url: 'testurl',
        title: 'testtitle',
        description: 'testdescription'
      })
      const result = await userUploadVideoController(mockReq, mockRes, mockNext)
      expect(socketService.notifyNewVideoSharedByUserId).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          _id: videoId,
          user_id: 'abcid',
          url: 'testurl',
          title: 'testtitle',
          description: 'testdescription'
        },
        message: ApiResponseMessage.VIDEO_SHARED
      })
    })
  })

  describe('getVideoInfoController', () => {
    it('should get video info by id success', async () => {
      const mockReq: any = {
        params: {
          video_id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const videoId = new ObjectId()
      const mockVideo = (videoService.getVideoInfo as jest.Mock).mockResolvedValue({
        video_id: videoId,
        user_id: 'abcid',
        url: 'testurl',
        title: 'testtitle',
        description: 'testdescription'
      })
      const mockInteraction = (videoService.getVideoInteraction as jest.Mock).mockResolvedValue({
        video_id: videoId,
        up_vote: 0,
        down_vote: 0
      })
      const result = await getVideoInfoController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user_id: 'abcid',
          url: 'testurl',
          title: 'testtitle',
          description: 'testdescription',
          up_vote: 0,
          down_vote: 0,
          video_id: videoId
        },
        message: `Video info by id abcid`
      })
    })
  })

  describe('getListVideoController', () => {
    it('should get list of videos success', async () => {
      const mockReq: any = {
        query: {
          startIndex: '0',
          limit: '10'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const videoId = new ObjectId()
      const mockVideos = (videoService.getListVideos as jest.Mock).mockResolvedValue([
        {
          _id: videoId,
          user_id: 'abcid',
          url: 'testurl',
          title: 'testtitle',
          description: 'testdescription'
        }
      ])
      const mockTotal = (videoService.getTotalVideosCount as jest.Mock).mockResolvedValue(1)
      const result = await getListVideoController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          videos: [
            {
              _id: videoId,
              user_id: 'abcid',
              url: 'testurl',
              title: 'testtitle',
              description: 'testdescription'
            }
          ],
          nextIndex: 1,
          total: 1
        },
        message: ApiResponseMessage.LIST_OF_VIDEOS
      })
    })
  })

  describe('getListVideoOfUserController', () => {
    it('should get list of videos by user id success', async () => {
      const mockReq: any = {
        params: {
          user_id: 'abcid'
        },
        query: {
          startIndex: '0',
          limit: '10'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const videoId = new ObjectId()
      const mockVideos = (videoService.getVideosOfUser as jest.Mock).mockResolvedValue([
        {
          _id: videoId,
          user_id: 'abcid',
          url: 'testurl',
          title: 'testtitle',
          description: 'testdescription'
        }
      ])
      const mockTotal = (videoService.getVideosOfUserCount as jest.Mock).mockResolvedValue(1)
      const result = await getListVideoOfUserController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          videos: [
            {
              _id: videoId,
              user_id: 'abcid',
              url: 'testurl',
              title: 'testtitle',
              description: 'testdescription'
            }
          ],
          nextIndex: 1,
          total: 1
        },
        message: `List of videos by user id abcid`
      })
    })
  })

  describe('userUpVoteVideoController', () => {
    it('should up vote a video success', async () => {
      const mockReq: any = {
        tokenPayload: {
          user_id: 'abcid'
        },
        body: {
          video_id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const videoId = new ObjectId()
      const mockInteraction = (videoService.interactWithVideo as jest.Mock).mockResolvedValue({
        video_id: videoId,
        up_vote: 1,
        down_vote: 0
      })
      const result = await userUpVoteVideoController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          video_id: videoId,
          up_vote: 1,
          down_vote: 0
        },
        message: ApiResponseMessage.HANDLE_VIDEO_UP_VOTE_SUCCESSFULLY
      })
    })
  })

  describe('userDownVoteVideoController', () => {
    it('should down vote a video success', async () => {
      const mockReq: any = {
        tokenPayload: {
          user_id: 'abcid'
        },
        body: {
          video_id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const videoId = new ObjectId()
      const mockInteraction = (videoService.interactWithVideo as jest.Mock).mockResolvedValue({
        video_id: videoId,
        up_vote: 0,
        down_vote: 1
      })
      const result = await userUpVoteVideoController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          video_id: videoId,
          up_vote: 0,
          down_vote: 1
        },
        message: ApiResponseMessage.HANDLE_VIDEO_UP_VOTE_SUCCESSFULLY
      })
    })
  })

  describe('userDeleteVideoController', () => {
    it('should delete a video success', async () => {
      const mockReq: any = {
        tokenPayload: {
          user_id: 'abcid'
        },
        body: {
          video_id: 'abcid'
        }
      }
      const mockRes: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mockNext: any = jest.fn()
      const videoId = new ObjectId()
      const mockVideo = (videoService.deleteVideo as jest.Mock).mockResolvedValue({
        video_id: videoId
      })
      const result = await userDeleteVideoController(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          video_id: videoId
        }
      })
    })
  })
})
