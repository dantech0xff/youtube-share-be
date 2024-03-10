import AppNotification, { AppNotificationState } from '~/models/db-schemas/Notification.schema'
import databaseService from './database.service'
import { ObjectId } from 'mongodb'

interface INotificationService {
  insertNotificationToUser(params: { to_user_id: string; content: string; state: string }): Promise<AppNotification>
  findNotificationsByUserId(params: { user_id: string }): Promise<AppNotification[]>
  findNotReceivedNotificationsByUserId(params: { user_id: string }): Promise<AppNotification[]>
  updateNotificationStateById(params: { notification_id: string; state: string }): Promise<void>
}

class NotificationsService implements INotificationService {
  async insertNotificationToUser(params: { to_user_id: string; content: string; state: string }) {
    const now = new Date()
    const insertObject = new AppNotification({
      to_user_id: new ObjectId(params.to_user_id),
      content: params.content,
      state: params.state,
      create_at: now
    })
    await databaseService.notifications.insertOne(insertObject)
    return insertObject
  }
  async findNotificationsByUserId(params: { user_id: string }) {
    return await databaseService.notifications.find({ to_user_id: new ObjectId(params.user_id) }).toArray()
  }
  async updateNotificationStateById(params: { notification_id: string; state: string }) {
    await databaseService.notifications.updateOne(
      { _id: new ObjectId(params.notification_id) },
      { $set: { state: params.state } }
    )
  }
  async findNotReceivedNotificationsByUserId(params: { user_id: string }) {
    return await databaseService.notifications
      .find({
        to_user_id: new ObjectId(params.user_id),
        state: { $in: [AppNotificationState.SENDING] }
      })
      .toArray()
  }
}

const notificationsService: INotificationService = new NotificationsService()
export default notificationsService
