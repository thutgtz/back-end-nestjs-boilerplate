import { Reflector } from '@nestjs/core'
import { PermissionEnum } from 'src/app/services/domain/permission.domain'

export const RequirePermissions = Reflector.createDecorator<PermissionEnum[]>()
