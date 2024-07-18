import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ProductV1GetByUserIdRes {
  @IsNotEmpty() @IsString() @ApiProperty() id: string
  @IsNotEmpty() @IsString() @ApiProperty() name: string
}
