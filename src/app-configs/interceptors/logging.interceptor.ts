import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'
import { CustomLogger } from '../../utilities/customLogger/custom-logger'
import { CustomResponse } from './models/custom-response.model'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private customLogger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const request = http.getRequest<Request>()
    const response = http.getResponse<Response>()

    return next
      .handle()
      .pipe(
        tap((data: CustomResponse<any>) =>
          this.customLogger.logApiRequestResponse(request, data.statusCode, response.statusCode, data)
        )
      )
  }
}
