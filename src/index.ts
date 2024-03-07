import express, { NextFunction, Request, Response } from 'express'
import databaseService from './services/database.service'
import { appEnvConfig } from './constants/envConfig'
import usersRouter from './routes/users.routes'
import { HTTP_CODES } from './constants/HTTP_CODES'
const app = express()

databaseService
  .connect()
  .then(() => {
    databaseService.createIndexUsers()
  })
  .catch(console.error)
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/users', usersRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Temporary error handling
  res.status(HTTP_CODES.FORBIDDEN).json({ message: 'Something happened!', error: `${err}` })
})

app.listen(appEnvConfig.port, () => {
  console.log(`Server is running at http://localhost:${appEnvConfig.port}`)
})
