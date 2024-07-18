import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SwaggerApiResponse } from '../../app-configs/decorators/response-swager-doc.decorator'
import { AuthenticationService } from '../services/authentication.service'
import { AuthenticationV1LoginReq, AuthenticationV1LoginRes } from './dto/authentication.v1-login.dto'
import {
  AuthenticationV1LineAuthorizeReq,
  AuthenticationV1LineAuthorizeRes,
} from './dto/authentication.v1-line-authorize.dto'
import { AuthenticationV1LineLinkAccountReq } from './dto/authentication.v1-line-link-account.dto'
import { AuthenticationV1LineCreateAccountReq } from './dto/authentication.v1-line-create-account.dto'

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
    return this.authenticationService.adminLogin(body.citizenId, body.password)
  }

  @Post('/v1/line/authorize')
  @SwaggerApiResponse(AuthenticationV1LineAuthorizeRes)
  @ApiOperation({
    description: 'Enpoint สำหรับ authorize ด้วย line id token',
  })
  async lineAuthorize(@Query() query: AuthenticationV1LineAuthorizeReq): Promise<AuthenticationV1LineAuthorizeRes> {
    return this.authenticationService.lineAuthorize(query.lineTokenId)
  }

  @Post('/v1/line/link-account')
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint สำหรับ link line account',
  })
  async lineLinkAccount(@Body() body: AuthenticationV1LineLinkAccountReq): Promise<void> {
    return this.authenticationService.lineLinkAccount(body.lineTokenId, body.citizenId)
  }

  @Post('/v1/line/create-account')
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint สำหรับสร้าง line account',
  })
  async lineCreateAccount(@Body() body: AuthenticationV1LineCreateAccountReq): Promise<void> {
    return this.authenticationService.lineCreateAccount(body.lineTokenId)
  }
}
