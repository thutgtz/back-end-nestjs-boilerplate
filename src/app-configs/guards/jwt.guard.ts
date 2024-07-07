import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { IS_REQUIRE_AUTH } from '../decorators/require-authorize.decorator'
import { CustomLogger } from '../../utilities/customLogger/custom-logger'
import { Configs } from '../configs/env.config'
import { Permission } from '../../app/services/domain/permission.domain'

export class jwtPayload {
  userId: string
  permissions: string[]
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService<Configs>,
    private jwtService: JwtService,
    private customLogger: CustomLogger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    const isRequireAuthorize = this.reflector.getAllAndOverride<boolean>(IS_REQUIRE_AUTH, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!isRequireAuthorize) {
      return true
    }

    if (!token) {
      throw new HttpException('access token not found.', HttpStatus.UNAUTHORIZED)
    }

    try {
      const payload = await this.jwtService.verifyAsync<jwtPayload>(token, {
        secret: this.configService.get('jwtSecret'),
      })
      request.userId = payload.userId
      request.permissions = Permission.FromStringArray(payload.permissions)
    } catch (error) {
      this.customLogger.error(error)
      throw new HttpException('unable to verify access token.', HttpStatus.UNAUTHORIZED)
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
