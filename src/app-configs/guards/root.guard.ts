import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { IS_REQUIRE_AUTH } from '../decorators/require-authorize.decorator'
import { Configs } from '../configs/env.config'
import { ROOT_ONLY } from '../decorators/root-only.decorator'

export class jwtPayload {
  userId: string
  permissions: string[]
}

@Injectable()
export class RootGuard implements CanActivate {
  constructor(private reflector: Reflector, private configService: ConfigService<Configs>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const rootOnly = this.reflector.getAllAndOverride<boolean>(ROOT_ONLY, [context.getHandler(), context.getClass()])

    if (!rootOnly) return true

    if (!request.headers.authorization === this.configService.get('rootToken')) {
      throw new HttpException('root require.', HttpStatus.FORBIDDEN)
    }

    return true
  }
}
