import { Server as HttpServer, createServer } from 'http'
import { Socket, Server as SocketServer } from 'socket.io'
import { ApiResponseMessage } from '~/constants/Messages'
import { appEnvConfig } from '~/constants/envConfig'
import AppNotification, { AppNotificationState } from '~/models/db-schemas/Notification.schema'
import Video from '~/models/db-schemas/Video.schema'
import notificationsService from '~/services/notifications.service'
import userServices from '~/services/users.service'
import { verifyToken } from '~/utils/jwt'

const NEW_NOTIFICATION_EVENT = 'new-notification'
const READ_NOTIFICATION_EVENT = 'read-notification'
const RECEIVE_NOTIFICATION_EVENT = 'receive-notification'

interface ISocketService {
  initSocket(express: any): void
  listen(port?: number, listeningListener?: () => void): void
  notifyNewVideoSharedByUserId(params: { data: Video }): Promise<void>
}

class SocketServiceImpl implements ISocketService {
  private httpServer: HttpServer | null = null
  private io: any

  // map of user_id and list of socket_id
  private onlineUsersMap: Map<string, Set<string>> = new Map<string, Set<string>>()

  initSocket(express: any): void {
    this.httpServer = createServer(express)
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: appEnvConfig.isProduction ? appEnvConfig.clientURL : '*'
      }
    })

    this.io.on('connection', async (socket: Socket) => {
      const socketId = socket.id
      const tokenPayload = socket.handshake.auth.tokenPayload
      const user_id = tokenPayload.user_id

      if (this.onlineUsersMap.has(user_id)) {
        this.onlineUsersMap.set(user_id, this.onlineUsersMap.get(user_id)?.add(socketId) as Set<string>)
      } else {
        this.onlineUsersMap.set(user_id, new Set([socketId]))
      }
      console.log(`a user connected  ${tokenPayload.user_id} ${this.onlineUsersMap.size}`)

      console.log('onlineUsersMap', this.onlineUsersMap)

      socket.on('disconnect', () => {
        const socketIds = this.onlineUsersMap.get(user_id)
        if (socketIds) {
          socketIds.delete(socketId)
          if (socketIds.size === 0) {
            this.onlineUsersMap.delete(user_id)
          }
        }
        console.log(`user disconnected ${tokenPayload.user_id} ${this.onlineUsersMap.size}`)
      })

      socket.on(RECEIVE_NOTIFICATION_EVENT, (notification_id: string) => {
        notificationsService.updateNotificationStateById({
          notification_id,
          state: AppNotificationState.RECEIVED
        })
      })
      socket.on(READ_NOTIFICATION_EVENT, (notification_id: string) => {
        notificationsService.updateNotificationStateById({
          notification_id,
          state: AppNotificationState.READ
        })
      })

      const listSendingAndNotSendNotifications = await notificationsService.findNotReceivedNotificationsByUserId({
        user_id: socket.handshake.auth.tokenPayload.user_id
      })
      for (const notification of listSendingAndNotSendNotifications) {
        socket.emit(NEW_NOTIFICATION_EVENT, notification)
      }
    })

    this.io.use(async (socket: any, next: any) => {
      let authorization = socket.handshake.headers.authorization
      if (!authorization) {
        authorization = socket.handshake.auth.Authorization
      }
      if (!authorization) {
        return socket.handshake.auth.authorization
      }

      if (!authorization) {
        return next(new Error(ApiResponseMessage.AUTHENTICATION_ERROR))
      }
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(new Error(ApiResponseMessage.AUTHENTICATION_ERROR))
      }
      try {
        const decoded_token = await verifyToken({ token, secretOrPublicKey: appEnvConfig.jwtAccessSecret })
        socket.handshake.auth.tokenPayload = decoded_token
        return next()
      } catch (error) {
        return next(new Error(ApiResponseMessage.AUTHENTICATION_ERROR))
      }
    })
  }

  listen(port?: number, listeningListener?: () => void): void {
    this.httpServer?.listen(port, listeningListener)
  }
  async notifyNewVideoSharedByUserId(params: { data: Video }) {
    console.log('notifyNewVideoSharedByUserId', JSON.stringify(params))
    const userInfo = await userServices.findUserWithId(params.data.user_id.toString())

    if (appEnvConfig.enableGlobalNotificationNewVideo) {
      this.io.emit(NEW_NOTIFICATION_EVENT, {
        to_user_id: 'you',
        content: `New video shared by ${userInfo.email}`,
        video: params.data
      })
    } else {
      const user_id = params.data.user_id.toString()
      const listOfFollowers = await userServices.getListOfFollowersByUserId(user_id)
      for (const follower of listOfFollowers) {
        const notification = await notificationsService.insertNotificationToUser({
          to_user_id: follower.toString(),
          content: `New video shared by ${params.data.user_id}`,
          state: AppNotificationState.SENDING
        })
        const socketIds = this.onlineUsersMap.get(follower.toString())
        if (socketIds && socketIds.size > 0) {
          for (const socketId of socketIds) {
            this.io.to(socketId).emit(NEW_NOTIFICATION_EVENT, { ...notification, video: params.data })
          }
        }
      }
    }
  }
}

const socketService: ISocketService = new SocketServiceImpl()

export default socketService
