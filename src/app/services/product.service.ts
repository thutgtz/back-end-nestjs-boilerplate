import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users.repository'
import { UserPermissionRepository } from '../repositories/user-permissions.repository'
import { User } from './domain/user.domain'
import { UserV1CreateReq } from '../controllers/dto/user.v1-create.dto'
import { Permission, PermissionEnum } from './domain/permission.domain'
import { PrismaService } from '../../utilities/prismaModule/prisma.service'
import { BussinessException } from '../../app-configs/interceptors/models/custom-response.model'
import { UserV1UpdateReq } from '../controllers/dto/user.v1-update.dto'
import { ProductsRepository } from '../repositories/products.repository'
import { Product } from './domain/product.domain'
import { ProductV1CreateReq } from '../controllers/dto/product.v1-create.dto'
import { ProductV1GetByUserIdRes } from '../controllers/dto/product.v1-get-by-user-id.dto'
import { ProductV1DeleteReq } from '../controllers/dto/product.v1-delete.dto'

@Injectable()
export class ProductService {
  constructor(private productsRepository: ProductsRepository) {}

  async createProduct(body: ProductV1CreateReq, userId: string): Promise<void> {
    const product = new Product(body.name, userId)
    await this.productsRepository.createOne(product)
  }

  async deleteProduct(body: ProductV1DeleteReq): Promise<void> {
    const findProduct = await this.productsRepository.findOneById(body.id)
    const product = Product.FromDb(findProduct)
    await this.productsRepository.deleteOne(product)
  }

  async getProductByUserId(userId: string): Promise<ProductV1GetByUserIdRes[]> {
    const products = await this.productsRepository.findManyByUserId(userId)

    return products.map((item): ProductV1GetByUserIdRes => {
      const product = new ProductV1GetByUserIdRes()
      product.id = item.id
      product.name = item.name

      return product
    })
  }
}
