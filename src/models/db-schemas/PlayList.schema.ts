import { ObjectId } from 'mongodb'

export default class PlayList {
  _id: ObjectId
  user_id: ObjectId
  create_at: Date
  update_at: Date
  // TBD
  constructor(obj: any) {
    const now = new Date()
    this._id = obj._id || new ObjectId()
    this.user_id = obj.user_id
    this.create_at = obj.create_at || now
    this.update_at = obj.update_at || now
  }
}
