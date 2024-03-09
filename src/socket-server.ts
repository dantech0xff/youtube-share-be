import { Server as ServerHttp } from 'http'
import { Server as ServerSocket } from 'socket.io'
import { appEnvConfig } from './constants/envConfig'

const initSocketServer = (server: ServerHttp) => {
  const io = new ServerSocket(server, {
    cors: {
      origin: appEnvConfig.isProduction ? appEnvConfig.clientURL : '*'
    }
  })
  const users: {
    [key: string]: string
  } = {}

  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}
