import { Injectable } from '@nestjs/common'
import { PrismaService, Transaction } from '../../utilities/prismaModule/prisma.service'
import { User } from '../services/domain/user.domain'

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  findOneByUsername(username: string, trasaction: Transaction = this.prismaService) {
    return trasaction.users.findFirst({
      where: { username },
    })
  }

  findOneById(userId: string, trasaction: Transaction = this.prismaService) {
    return trasaction.users.findFirst({
      where: { id: userId },
    })
  }

  async createOne(users: User, trasaction: Transaction = this.prismaService): Promise<void> {
    await trasaction.users.create({
      data: users.toDb(),
    })
  }

  async updateOne(users: User, trasaction: Transaction = this.prismaService): Promise<void> {
    await trasaction.users.update({
      data: users.toDb(),
      where: { id: users.getId() },
    })
  }
}
