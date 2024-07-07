import { ConfigFactory } from '@nestjs/config'
import { Configs } from '../../src/app-configs/configs/env.config'

export const mockEnvConfiguration: ConfigFactory<Configs> = () => ({
  appName: 'mock-appName',
  jwtSecret: 'mock-jwtSecret',
  lineAccessToken: 'mock-lineAccessToken',
  lineNotifyToken: 'mock-lineNotifyToken',
  nodeEnv: 'mock',
  port: 8080,
  rootToken: 'mock-rootToken',
})
