import { products as Products } from '@prisma/client'
import { randomUUID } from 'crypto'

export class Product {
  private id: string
  private name: string
  private userId: string
  private createdAt: Date

  constructor(name: string, userId: string) {
    this.id = randomUUID()
    this.name = name
    this.userId = userId
    this.createdAt = new Date()
  }

  static FromDb(products: Products): Product {
    const product = new Product(null, null)
    product.id = products.id
    product.name = products.name
    product.userId = products.user_id
    product.createdAt = products.created_at
    return product
  }

  toDb(): Products {
    return {
      id: this.id,
      name: this.name,
      user_id: this.userId,
      created_at: this.createdAt,
    }
  }

  getId(): string {
    return this.id
  }
}
