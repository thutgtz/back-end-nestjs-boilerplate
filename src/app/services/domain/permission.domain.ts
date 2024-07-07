import { user_permissions as UserPermissions } from '@prisma/client'

export class Permission {
  private permissions: PermissionEnum[]

  static FromPermissionEnumArray(arr: PermissionEnum[]): Permission {
    const permission = new Permission()
    permission.permissions = arr

    return permission
  }

  static FromStringArray(str: string[]): Permission {
    const permission = new Permission()
    const aviablePermission = Object.values(PermissionEnum)
    permission.permissions = str
      .filter((e) => aviablePermission.includes(e as PermissionEnum))
      .map((e) => PermissionEnum[e])

    return permission
  }

  static FromUserPermissions(userPermissions: UserPermissions[]): Permission {
    const permission = new Permission()
    const aviablePermission = Object.values(PermissionEnum)
    permission.permissions = userPermissions
      .filter((e) => aviablePermission.includes(e.permission as PermissionEnum))
      .map((e) => PermissionEnum[e.permission])

    return permission
  }

  can(permission: PermissionEnum): boolean {
    return this.permissions.includes(permission)
  }

  toStringArray(): string[] {
    return this.permissions.map((e) => e.toString())
  }
}

export enum PermissionEnum {
  CREATE_RICH_MENU = 'CREATE_RICH_MENU',
  READ_RICH_MENU = 'READ_RICH_MENU',
}
