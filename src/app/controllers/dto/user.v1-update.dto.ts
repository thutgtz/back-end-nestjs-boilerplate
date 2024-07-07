import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class UserV1UpdateReq {
  @IsNotEmpty() @IsUUID() @ApiProperty() userId: string
  @IsNotEmpty() @IsString() @ApiProperty() password: string
}
