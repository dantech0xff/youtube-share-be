import { MongoClient, Db, Collection } from 'mongodb'
import { appEnvConfig } from '~/constants/envConfig'

const dbConnectionUrl = `mongodb+srv://${appEnvConfig.mongoDbUserName}:${appEnvConfig.mongoDbUserPassword}@db001.kcqryme.mongodb.net/?retryWrites=true&w=majority&appName=db001`
console.log(dbConnectionUrl)

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(dbConnectionUrl)
    this.db = this.client.db(appEnvConfig.mongoDbName)
  }

  async connect() {
    try {
      await this.client.connect()
      console.log('Connected to MongoDB')
      await this.db.command({ ping: 1 })
      console.log(`Ping to MongoDB ${appEnvConfig.mongoDbName}`)
    } catch (error) {
      console.error('Error connecting to MongoDB', error)
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
