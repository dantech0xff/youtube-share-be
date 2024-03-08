import { MongoClient, Db, Collection } from 'mongodb'
import { appEnvConfig } from '~/constants/envConfig'
import Follower from '~/models/db-schemas/Follower.schema'
import Interaction from '~/models/db-schemas/Interaction.schema'
import User from '~/models/db-schemas/User.schema'
import Video from '~/models/db-schemas/Video.schema'

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

  get users(): Collection<User> {
    return this.db.collection<User>('users')
  }

  get followers(): Collection<Follower> {
    return this.db.collection<Follower>('followers')
  }

  get videos(): Collection<Video> {
    return this.db.collection<Video>('videos')
  }

  get interactions(): Collection<Interaction> {
    return this.db.collection<Interaction>('interactions')
  }

  async createIndexUsers() {
    const indexExists = await this.users.listIndexes().toArray()
    if (indexExists.length > 1) return
    await this.users.createIndex({ email: 1 }, { unique: true })
    await this.users.createIndex({ username: 1 }, { unique: true })
  }
}

const databaseService = new DatabaseService()
export default databaseService
