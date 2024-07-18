import { Injectable } from '@nestjs/common'
import { PrismaService, Transaction } from '../../utilities/prismaModule/prisma.service'
import { User } from '../services/domain/user.domain'
import { randomUUID } from 'crypto'

@Injectable()
export class UserLineRepository {
  constructor(private prismaService: PrismaService) {}

  findOneByUserId(userId: string, trasaction: Transaction = this.prismaService) {
    return trasaction.user_line.findFirst({
      where: { user_id: userId },
    })
  }

  findOneByLineId(lineId: string, trasaction: Transaction = this.prismaService) {
    return trasaction.user_line.findFirst({
      where: { line_id: lineId },
    })
  }

  async createOne(users: User, lineId: string, trasaction: Transaction = this.prismaService): Promise<void> {
    await trasaction.user_line.create({
      data: {
        id: randomUUID(),
        user_id: users.getId(),
        line_id: lineId,
        created_at: new Date(),
      },
    })
  }
}
