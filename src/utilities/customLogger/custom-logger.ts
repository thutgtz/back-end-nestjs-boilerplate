import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import { transports, format } from 'winston'
import * as cls from 'cls-hooked'
import 'winston-daily-rotate-file'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { LogModel } from './models/log.model'
import { Configs } from '../../app-configs/configs/env.config'
import { AxiosResponse } from 'axios'

@Injectable()
export class CustomLogger {
  public logger: winston.Logger

  constructor(private configService: ConfigService<Configs>) {
    const consoleFormat = format.combine(format.ms(), format.timestamp(), format.json())

    this.logger = winston.createLogger({
      level: 'debug',
      format: consoleFormat,
      defaultMeta: {
        service: `${configService.get('appName').toLocaleLowerCase()}-logs`,
      },
      transports: [new transports.Console()],
    })
  }

  getCorrelationId(): string {
    const clsNamespace = cls.getNamespace('app')
    return clsNamespace.get('correlationId')
  }

  logApiRequestResponse(request: Request, statusCode: string, httpStatus: number, data?: any) {
    if (request.url.includes('health-check')) return new LogModel()
    const logInfo = plainToInstance(LogModel, {
      correlationId: this.getCorrelationId(),
      endpoint: request.url,
      body: JSON.stringify(request.body),
      param: JSON.stringify(request.query),
      userId: (request as any).userId,
      response: JSON.stringify(data),
      statusCode,
      httpStatus,
    })
    this.logger.info('api-log', logInfo)
    return logInfo
  }

  logAxiosHttpResponse(res: AxiosResponse) {
    const logInfo = plainToInstance(LogModel, {
      correlationId: res.config.headers?.correlationId,
      endpoint: res.config.url,
      body: JSON.stringify(res.config.data),
      param: JSON.stringify(res.config.params),
      userId: res.config.headers?.userId,
      response: JSON.stringify(res.data),
    })
    this.logger.info('axios-http', logInfo)
    return logInfo
  }

  log(message: string) {
    const logInfo = plainToInstance(LogModel, {
      correlationId: this.getCorrelationId(),
    })
    this.logger.info(message, logInfo)
  }

  error(error: Error) {
    const logInfo = plainToInstance(LogModel, {
      correlationId: this.getCorrelationId(),
      message: error.message,
      errorStack: JSON.stringify(error.stack),
    })
    this.logger.error('error', logInfo)
    return logInfo
  }
}
