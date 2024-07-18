import { ConfigFactory } from '@nestjs/config'

export class Configs {
  nodeEnv: string
  appName: string
  port: number
  jwtSecret: string
  rootToken: string
  lineNotifyToken: string
  lineAccessToken: string
  lineLoginChannelId: string
}

export const envConfiguration: ConfigFactory<Configs> = () => ({
  nodeEnv: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  port: parseInt(process.env.APP_PORT, 10),
  lineNotifyToken: process.env.LINE_NOTIFY_TOKEN,
  lineAccessToken: process.env.LINE_ACCESS_TOKEN,
  jwtSecret: process.env.JWT_SECRET,
  rootToken: process.env.ROOT_TOKEN,
  lineLoginChannelId: process.env.LINE_LOGIN_CHANNEL_ID,
})
