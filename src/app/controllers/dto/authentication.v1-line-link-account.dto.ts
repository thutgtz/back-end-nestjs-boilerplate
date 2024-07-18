import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthenticationV1LineLinkAccountReq {
  @IsNotEmpty() @IsString() @ApiProperty() lineTokenId: string
  @IsNotEmpty() @IsString() @ApiProperty() citizenId: string
}
