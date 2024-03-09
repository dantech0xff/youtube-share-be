import express, { NextFunction, Request, Response } from 'express'
import databaseService from './services/database.service'
import { appEnvConfig } from './constants/envConfig'
import usersRouter from './routes/users.routes'
import { HTTP_CODES } from './constants/HTTP_CODES'
import videosRouter from './routes/videos.routes'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { ApiResponseMessage } from './constants/Messages'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import socketService from './socket/SocketService'

databaseService
  .connect()
  .then(() => {
    databaseService.createIndexUsers()
  })
  .catch(console.error)

const app = express()
app.use(express.json())
app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: ApiResponseMessage.TOO_MANY_REQUESTS,
    standardHeaders: true,
    legacyHeaders: true
  })
)
app.use(
  cors({
    origin: appEnvConfig.isProduction ? appEnvConfig.clientURL : '*'
  })
)

app.get('/', (req, res) => {
  res.send('Hello RENEC!')
})
app.use('/users', usersRouter)
app.use('/videos', videosRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Temporary error handling
  res.status(HTTP_CODES.FORBIDDEN).json({ message: 'Something happened!', error: `${err}` })
})

socketService.initSocket(app)
const port = parseInt(appEnvConfig.port as string) || 3000
socketService.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
