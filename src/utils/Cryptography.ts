import { createHash } from 'crypto'
import { appEnvConfig } from '~/constants/envConfig'

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + appEnvConfig.passwordSecret)
}
