import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthenticationV1LineAuthorizeReq {
  @IsNotEmpty() @IsString() @ApiProperty() lineTokenId: string
}

export class AuthenticationV1LineAuthorizeRes {
  @IsNotEmpty() @IsString() @ApiProperty() accessToken: string
}
