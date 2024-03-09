import { ObjectId } from 'mongodb'
import Video from '~/models/db-schemas/Video.schema'
import databaseService from './database.service'
import Interaction, { InteractionActionType } from '~/models/db-schemas/Interaction.schema'
import { ApiResponseMessage } from '~/constants/Messages'

class VideoService {
  async uploadVideo(input: { user_id: string; url: string; title: string; description: string }) {
    const insertResult = await databaseService.videos.insertOne(
      new Video({
        ...input,
        user_id: new ObjectId(input.user_id)
      })
    )
    return { video_id: insertResult.insertedId }
  }

  async deleteVideo(input: { video_id: string; user_id: string }) {
    const deleteResult = await databaseService.videos.deleteOne({
      _id: new ObjectId(input.video_id),
      user_id: new ObjectId(input.user_id)
    })
    if (deleteResult.deletedCount === 0) {
      return { message: ApiResponseMessage.VIDEO_IS_NOT_YOURS }
    }
    return { message: ApiResponseMessage.VIDEO_DELETED }
  }

  async isVideoUrlExisted(input: { user_id: string; url: string }) {
    return Boolean(await databaseService.videos.findOne({ url: input.url, user_id: new ObjectId(input.user_id) }))
  }
  async getVideoInfo(video_id: string) {
    const videoResult = await databaseService.videos.findOne({ _id: new ObjectId(video_id) })
    if (!videoResult) {
      throw new Error('Video not found!')
    }
    return {
      video_id: videoResult._id,
      user_id: videoResult.user_id,
      url: videoResult.url,
      title: videoResult.title,
      description: videoResult.description,
      views: videoResult.views,
      create_at: videoResult.create_at,
      update_at: videoResult.update_at
    }
  }

  async getVideoInteraction(video_id: string) {
    const interactionResults = await databaseService.interactions.find({ video_id: new ObjectId(video_id) }).toArray()
    if (!interactionResults) {
      return { video_id, up_vote: 0, down_vote: 0 }
    }
    const up_vote = interactionResults.filter(
      (interaction) => interaction.action === InteractionActionType.UP_VOTE
    ).length
    const down_vote = interactionResults.filter(
      (interaction) => interaction.action === InteractionActionType.DOWN_VOTE
    ).length
    return { up_vote, down_vote, video_id }
  }

  async getVideosInteraction(video_ids: string[]) {
    const interactionResults = await databaseService.interactions
      .find({ video_id: { $in: video_ids.map((id) => new ObjectId(id)) } })
      .toArray()
    const videoInteractions = interactionResults.reduce(
      (acc, interaction) => {
        const video_id = interaction.video_id.toHexString()
        if (!acc[video_id]) {
          acc[video_id] = { up_vote: 0, down_vote: 0 }
        }
        if (interaction.action === InteractionActionType.UP_VOTE) {
          acc[video_id].up_vote++
        } else {
          acc[video_id].down_vote++
        }
        return acc
      },
      {} as { [key: string]: { up_vote: number; down_vote: number } }
    )
    return videoInteractions
  }

  async getListVideos(input: { startIndex: number; limit: number }) {
    const videos = await databaseService.videos
      .find()
      .sort({ create_at: -1 })
      .skip(input.startIndex)
      .limit(input.limit)
      .toArray()
    return videos
  }
  async getTotalVideosCount() {
    return await databaseService.videos.countDocuments()
  }

  async getVideosOfUser(input: { user_id: string; startIndex: number; limit: number }) {
    const videos = await databaseService.videos
      .find({ user_id: new ObjectId(input.user_id) })
      .sort({ create_at: -1 })
      .skip(input.startIndex)
      .limit(input.limit)
      .toArray()
    const videosInteraction = await this.getVideosInteraction(videos.map((video) => video._id.toHexString()))
    return videos.map((video) => {
      const video_id = video._id.toHexString()
      return {
        video_id,
        user_id: video.user_id,
        url: video.url,
        title: video.title,
        description: video.description,
        views: video.views,
        create_at: video.create_at,
        update_at: video.update_at,
        ...(videosInteraction[video_id] || { up_vote: 0, down_vote: 0 })
      }
    })
  }
  async getVideosOfUserCount(user_id: string) {
    return await databaseService.videos.countDocuments({ user_id: new ObjectId(user_id) })
  }

  async getVideosOfUsers(user_ids: string[]) {
    return await databaseService.videos.find({ user_id: { $in: user_ids.map((id) => new ObjectId(id)) } }).toArray()
  }

  async interactWithVideo(input: { user_id: string; video_id: string; action: InteractionActionType }) {
    const interactedResult = await databaseService.interactions.findOne({
      user_id: new ObjectId(input.user_id),
      video_id: new ObjectId(input.video_id)
    })
    if (!interactedResult) {
      await databaseService.interactions.insertOne(
        new Interaction({
          user_id: new ObjectId(input.user_id),
          video_id: new ObjectId(input.video_id),
          action: input.action
        })
      )
    } else {
      await databaseService.interactions.updateOne({ _id: interactedResult._id }, { $set: { action: input.action } })
    }
    return await this.getVideoInteraction(input.video_id)
  }
}

const videoService = new VideoService()

export default videoService
