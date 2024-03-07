import { ObjectId } from 'mongodb'

export default class User {
  _id: ObjectId
  username: string
  email: string
  password: string
  create_at: Date
  update_at: Date

  constructor(obj: any) {
    const now = new Date()
    this._id = obj._id || new ObjectId()
    this.username = obj.username || obj.email
    this.email = obj.email
    this.password = obj.password
    this.create_at = obj.create_at || now
    this.update_at = obj.update_at || now
  }
}
