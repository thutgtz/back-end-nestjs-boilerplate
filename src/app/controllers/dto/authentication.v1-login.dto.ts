import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthenticationV1LoginReq {
  @IsNotEmpty() @IsString() @ApiProperty() username: string
  @IsNotEmpty() @IsString() @ApiProperty() password: string
}

export class AuthenticationV1LoginRes {
  @ApiProperty() accessToken: string
}
