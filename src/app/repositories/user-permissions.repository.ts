import { Injectable } from '@nestjs/common'
import { PrismaService, Transaction } from '../../utilities/prismaModule/prisma.service'
import { Permission } from '../services/domain/permission.domain'

@Injectable()
export class UserPermissionRepository {
  constructor(private prismaService: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prismaService.user_permissions.findMany({
      where: { user_id: userId },
    })
  }

  async create(userId: string, permissions: Permission, transaction: Transaction = this.prismaService) {
    const currentTime = new Date()
    await transaction.user_permissions.createMany({
      data: permissions.toStringArray().map((e) => ({
        user_id: userId,
        permission: e,
        updated_at: currentTime,
        created_at: currentTime,
      })),
    })
  }

  async update(userId: string, permissions: Permission, transaction: Transaction = this.prismaService) {
    await transaction.user_permissions.deleteMany({
      where: { user_id: userId },
    })
    await this.create(userId, permissions, transaction)
  }
}
