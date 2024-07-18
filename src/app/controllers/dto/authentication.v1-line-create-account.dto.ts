import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthenticationV1LineCreateAccountReq {
  @IsNotEmpty() @IsString() @ApiProperty() lineTokenId: string
}
