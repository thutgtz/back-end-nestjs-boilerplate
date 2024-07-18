import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SwaggerApiResponse } from '../../app-configs/decorators/response-swager-doc.decorator'
import { UserService } from '../services/user.service'
import { UserV1CreateReq } from './dto/user.v1-create.dto'
import { UserV1UpdateReq } from './dto/user.v1-update.dto'
import { RootOnly } from '../../app-configs/decorators/root-only.decorator'

const prefix = 'user'

@ApiBearerAuth()
@ApiTags(prefix)
@Controller(prefix)
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/v1/create')
  @RootOnly()
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint สำหรับสร้าง user',
  })
  async createUser(@Body() body: UserV1CreateReq): Promise<void> {
    return this.userService.createUser(body)
  }

  @Post('/v1/update')
  @RootOnly()
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint สำหรับแก้ไข user',
  })
  async updateUser(@Body() body: UserV1UpdateReq): Promise<void> {
    return this.userService.updateUser(body)
  }
}
