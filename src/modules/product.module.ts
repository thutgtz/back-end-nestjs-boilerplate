import { Module } from '@nestjs/common'
import { PrismaModule } from '../utilities/prismaModule/prisma.module'
import { ProductsRepository } from '../app/repositories/products.repository'
import { ProductService } from '../app/services/product.service'
import { ProductController } from '../app/controllers/product.controller'

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, ProductsRepository],
})
export class ProductModule {}
