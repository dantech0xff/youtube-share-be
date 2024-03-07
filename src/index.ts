import express from 'express'
import databaseService from './services/database.service'
import { appEnvConfig } from './constants/envConfig'

const app = express()

databaseService.connect().catch(console.error)

app.get('/', (req, res) => {
  res.send('Hello RENEC!')
})
app.listen(appEnvConfig.port, () => {
  console.log(`Server is running at http://localhost:${appEnvConfig.port}`)
})
