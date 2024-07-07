import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as _ from 'lodash'

import { RequirePermissions } from '../decorators/require-permissions.decorator'
import { Permission } from '../../app/services/domain/permission.domain'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get(RequirePermissions, context.getHandler())

    if (!requiredPermissions) return true

    const request = context.switchToHttp().getRequest()
    const userPermission: Permission = request.permissions
    if (!userPermission) throw new HttpException('permissions not found in payload.', HttpStatus.UNAUTHORIZED)

    if (!requiredPermissions.every((requiredPermission) => userPermission.can(requiredPermission)))
      throw new HttpException(`require permission ${requiredPermissions}.`, HttpStatus.FORBIDDEN)
    return true
  }
}
