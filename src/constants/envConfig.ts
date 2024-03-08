import dotenv from 'dotenv'

dotenv.config()

export const appEnvConfig = {
  port: process.env.PORT,
  mongoDbUserName: process.env.MONGO_DB_USER_NAME,
  mongoDbUserPassword: process.env.MONGO_DB_USER_PASSWORD,
  mongoDbName: process.env.MONGO_DB_NAME,
  passwordSecret: process.env.PASSWORD_SECRET,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtAccessExpireIn: process.env.JWT_ACCESS_EXPIRED_IN as string,
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRED_IN as string
}
