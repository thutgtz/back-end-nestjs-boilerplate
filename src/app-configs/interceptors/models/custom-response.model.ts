import { HttpException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class BussinessException extends HttpException {
  constructor(message?: string, code?: number) {
    super(message, code)
  }
}

export class ResponseStatusCode {
  static success = '1000'
  static bussinessException = '1899'
  static unknownException = '1999'
}

export class CustomResponse<T> {
  @ApiProperty() statusCode: string
  @ApiProperty() message?: string
  @ApiProperty() data?: T

  static success<T>(data: T): CustomResponse<T> {
    const customResponse = new CustomResponse<T>()
    customResponse.statusCode = ResponseStatusCode.success
    customResponse.data = data
    return customResponse
  }
}
