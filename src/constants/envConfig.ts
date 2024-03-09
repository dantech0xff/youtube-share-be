import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
const env = process.env.NODE_ENV
if (!env) {
  console.error('No NODE_ENV found!')
  console.error('Please set NODE_ENV before running the app')
  process.exit(1)
}

const envFileName = `.env.${env}`
console.log(`ENV_NODE = ${env}, now we're using '${envFileName}' to load Environment Variables!`)
if (!fs.existsSync(path.resolve(envFileName))) {
  console.error(`No ${envFileName} found!`)
  console.error(`Please create ${envFileName} before running the app`)
  process.exit(1)
}

dotenv.config({
  path: envFileName
})

export const appEnvConfig = {
  isProduction: process.env.NODE_ENV === 'prod',
  clientURL: process.env.CLIENT_URL as string,
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
