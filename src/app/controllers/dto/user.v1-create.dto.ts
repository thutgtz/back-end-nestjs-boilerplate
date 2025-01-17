import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UserV1CreateReq {
  @IsNotEmpty() @IsString() @ApiProperty() citizenId: string
  @IsNotEmpty() @IsString() @ApiProperty() name: string
  @IsNotEmpty() @IsString() @ApiProperty() password: string
}
