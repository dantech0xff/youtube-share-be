import { ObjectId } from 'mongodb'

export enum InteractionActionType {
  UP_VOTE = 'up_vote',
  DOWN_VOTE = 'down_vote'
}

// class to represent interaction between user and video
export default class Interaction {
  _id: ObjectId
  user_id: ObjectId // the user who interacted
  video_id: ObjectId // the video is being interacted
  action: InteractionActionType // the action being taken
  create_at: Date
  constructor(obj: any) {
    const now = new Date()
    this._id = obj._id || new ObjectId()
    this.user_id = obj.user_id
    this.video_id = obj.video_id
    this.action = obj.action
    this.create_at = obj.create_at || now
  }
}
