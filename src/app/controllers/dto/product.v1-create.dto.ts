import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ProductV1CreateReq {
  @IsNotEmpty() @IsString() @ApiProperty() name: string
}
