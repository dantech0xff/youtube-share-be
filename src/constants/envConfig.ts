import dotenv from 'dotenv'

dotenv.config()

export const appEnvConfig = {
  port: process.env.PORT,
  mongoDbUserName: process.env.MONGO_DB_USER_NAME,
  mongoDbUserPassword: process.env.MONGO_DB_USER_PASSWORD,
  mongoDbName: process.env.MONGO_DB_NAME
}
