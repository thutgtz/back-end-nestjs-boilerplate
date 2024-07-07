import { Body, Controller, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SwaggerApiResponse } from '../../app-configs/decorators/response-swager-doc.decorator'
import { AuthenticationService } from '../services/authentication.service'
import { AuthenticationV1LoginReq, AuthenticationV1LoginRes } from './dto/authentication.v1-login.dto'

const prefix = 'authentication'

@ApiBearerAuth()
@ApiTags(prefix)
@Controller(prefix)
@Controller()
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('/v1/admin-login')
  @SwaggerApiResponse(AuthenticationV1LoginRes)
  @ApiOperation({
    description: 'Enpoint สำหรับเข้าสู่ระบบ',
  })
  async adminLogin(@Body() body: AuthenticationV1LoginReq): Promise<AuthenticationV1LoginRes> {
    return this.authenticationService.adminLogin(body.username, body.password)
  }
}
