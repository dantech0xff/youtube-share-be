import { ObjectId } from 'mongodb'

export enum AppNotificationState {
  SENDING = 'sending',
  RECEIVED = 'received',
  READ = 'read'
}

export default class AppNotification {
  _id: ObjectId
  to_user_id: ObjectId
  content: string
  create_at: Date
  state: string

  constructor(obj: any) {
    const now = new Date()
    this._id = obj._id || new ObjectId()
    this.to_user_id = obj.to_user_id
    this.content = obj.content
    this.create_at = obj.create_at || now
    this.state = obj.state || AppNotificationState.SENDING
  }
}
