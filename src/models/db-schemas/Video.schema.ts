import { ObjectId } from 'mongodb'

export default class Video {
  _id: ObjectId
  user_id: ObjectId
  url: string
  title: string
  description: string
  views: number
  create_at: Date
  update_at: Date

  constructor(obj: any) {
    const now = new Date()
    this._id = obj._id || new ObjectId()
    this.user_id = obj.user_id
    this.url = obj.url
    this.title = obj.title
    this.description = obj.description
    this.views = obj.views || 0
    this.create_at = obj.create_at || now
    this.update_at = obj.update_at || now
  }
}
