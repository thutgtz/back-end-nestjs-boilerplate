import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import * as compression from 'compression'
import { json as expressJson, urlencoded as expressUrlEncoded } from 'express'
import { AppModule } from './app.module'
import { Configs } from './app-configs/configs/env.config'
import { ValidationPipe } from '@nestjs/common'
import { CustomResponseInterceptor } from './app-configs/interceptors/response.interceptor'
import { correlationId } from './app-configs/middlewares/correlationId.middleware'
import { AllExceptionsFilter } from './app-configs/filters/exception.filter'
import { CustomLogger } from './utilities/customLogger/custom-logger'
import { LineNotiyService } from './utilities/lineNotify/line-notify.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    snapshot: true,
  })

  const configService = app.get<ConfigService<Configs>>(ConfigService)
  const httpAdapter = app.get<HttpAdapterHost>(HttpAdapterHost)
  const customLogger = app.get<CustomLogger>(CustomLogger)
  const lineNotiyService = app.get<LineNotiyService>(LineNotiyService)

  app.use(compression())
  app.use(expressJson({ limit: '50mb' }))
  app.use(expressUrlEncoded({ limit: '50mb', extended: true }))
  app.use(correlationId)

  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }))
  app.useGlobalInterceptors(new CustomResponseInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, customLogger, lineNotiyService))

  const config = new DocumentBuilder()
    .setTitle(`${configService.get('appName')} API`)
    .setDescription(`${configService.get('appName')} API description`)
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(configService.get('port'))
}

bootstrap()
