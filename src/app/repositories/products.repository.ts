import { Injectable } from '@nestjs/common'
import { PrismaService, Transaction } from '../../utilities/prismaModule/prisma.service'
import { Product } from '../services/domain/product.domain'

@Injectable()
export class ProductsRepository {
  constructor(private prismaService: PrismaService) {}

  findManyByUserId(userId: string, trasaction: Transaction = this.prismaService) {
    return trasaction.products.findMany({
      where: { user_id: userId },
    })
  }

  findOneById(id: string, trasaction: Transaction = this.prismaService) {
    return trasaction.products.findFirst({
      where: { id: id },
    })
  }

  async createOne(product: Product, trasaction: Transaction = this.prismaService): Promise<void> {
    await trasaction.products.create({
      data: product.toDb(),
    })
  }

  async deleteOne(product: Product, trasaction: Transaction = this.prismaService): Promise<void> {
    await trasaction.products.delete({
      where: { id: product.getId() },
    })
  }
}
