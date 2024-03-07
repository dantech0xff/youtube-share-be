import { ObjectId } from 'mongodb'

// Class to represent relationship between user and their 1 follower
export default class Follower {
  _id: ObjectId
  user_id: ObjectId // the user being followed
  follower_id: ObjectId // the follower

  constructor(obj: any) {
    const now = new Date()
    this._id = obj._id || new ObjectId()
    this.user_id = obj.user_id
    this.follower_id = obj.follower_id
  }
}
