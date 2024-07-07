import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Request } from 'express'
import { CustomLogger } from '../../utilities/customLogger/custom-logger'
import { BussinessException, CustomResponse, ResponseStatusCode } from '../interceptors/models/custom-response.model'
import { LineNotiyService } from 'src/utilities/lineNotify/line-notify.service'
import { ValidationError } from 'class-validator'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private customLogger: CustomLogger,
    private lineNotiyService: LineNotiyService
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const request: Request = ctx.getRequest()

    const responseBody = new CustomResponse()
    responseBody.message = (exception as any)?.message
    responseBody.statusCode = ResponseStatusCode.unknownException

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof BussinessException) {
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY
      responseBody.statusCode = exception.getStatus()?.toString() ?? ResponseStatusCode.bussinessException
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus()
    }

    const log = this.customLogger.logApiRequestResponse(request, responseBody.statusCode, httpStatus)
    if (exception instanceof BadRequestException) {
      exception.message = (exception.getResponse() as object)['message']
    }
    const errLog = this.customLogger.error(exception as Error)
    if (errLog.message) log.message = errLog.message

    this.lineNotiyService.sendNoti(log.toReadAbleFormat())

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
