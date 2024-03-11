import { getVideoListValidator, userShareVideoValidator } from '~/middlewares/videos.middlewares'
import videoService from '~/services/videos.service'

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
    deleteVideo: jest.fn(),
    isVideoUrlExisted: jest.fn()
  }
})

describe('userShareVideoValidator', () => {
  it('should call next if all fields are valid', async () => {
    const mockReq: any = {
      body: {
        url: 'https://www.youtube.com/watch?v=123',
        title: 'testtitle',
        description: 'testdescription'
      },
      tokenPayload: {
        user_id: 'abcid'
      }
    }
    const mockRes: any = {}
    const mockNext: any = jest.fn()
    const isExist = (videoService.isVideoUrlExisted as jest.Mock).mockResolvedValue(false)
    await userShareVideoValidator(mockReq, mockRes, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })
})

describe('getVideoListValidator', () => {
  it('should call next if all fields are valid', async () => {
    const mockReq: any = {
      query: {
        startIndex: 0,
        limit: 1
      }
    }
    const mockRes: any = {}
    const mockNext: any = jest.fn()
    await getVideoListValidator(mockReq, mockRes, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })
})
