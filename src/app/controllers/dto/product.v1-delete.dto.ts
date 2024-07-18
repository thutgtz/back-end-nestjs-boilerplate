import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ProductV1DeleteReq {
  @IsNotEmpty() @IsString() @ApiProperty() id: string
}
