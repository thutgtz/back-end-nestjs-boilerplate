import { Body, Controller, Get, Post, Request } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SwaggerApiResponse } from '../../app-configs/decorators/response-swager-doc.decorator'
import { ProductService } from '../services/product.service'
import { ProductV1CreateReq } from './dto/product.v1-create.dto'
import { RequireAuthorize } from '../../app-configs/decorators/require-authorize.decorator'
import { ProductV1GetByUserIdRes } from './dto/product.v1-get-by-user-id.dto'
import { ProductV1DeleteReq } from './dto/product.v1-delete.dto'

const prefix = 'product'

@ApiBearerAuth()
@ApiTags(prefix)
@Controller(prefix)
@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/v1/create')
  @RequireAuthorize()
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint สำหรับสร้าง product',
  })
  async createProduct(@Request() req, @Body() body: ProductV1CreateReq): Promise<void> {
    const { userId } = req
    if (!userId) throw new Error('userId not found.')
    return this.productService.createProduct(body, userId)
  }

  @Post('/v1/delete')
  @RequireAuthorize()
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint สำหรับลบ product',
  })
  async deleteProduct(@Body() body: ProductV1DeleteReq): Promise<void> {
    return this.productService.deleteProduct(body)
  }

  @Get('/v1/get-by-user-id')
  @RequireAuthorize()
  @SwaggerApiResponse(ProductV1GetByUserIdRes, 'array')
  @ApiOperation({
    description: 'Enpoint สำหรับสร้าง product',
  })
  async getProductByUserId(@Request() req): Promise<ProductV1GetByUserIdRes[]> {
    const { userId } = req
    if (!userId) throw new Error('userId not found.')
    return this.productService.getProductByUserId(userId)
  }
}
