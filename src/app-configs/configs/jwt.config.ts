import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt'
import { Configs } from './env.config'

@Injectable()
export default class JWTConfiguration implements JwtOptionsFactory {
  constructor(private configService: ConfigService<Configs>) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.configService.get('jwtSecret'),
      signOptions: { expiresIn: '7d' },
    }
  }
}
