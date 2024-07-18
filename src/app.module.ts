import { Module } from '@nestjs/common'
import { CustomLogger } from './utilities/customLogger/custom-logger'
import { LineNotiyService } from './utilities/lineNotify/line-notify.service'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './app-configs/interceptors/logging.interceptor'
import { ConfigModule } from '@nestjs/config'
import { envConfiguration } from './app-configs/configs/env.config'
import { HttpModule } from './utilities/customHttpModule/custom-http.module'
import { JwtGuard } from './app-configs/guards/jwt.guard'
import { PermissionGuard } from './app-configs/guards/permissions.guard'
import { RichMenuModule } from './modules/rich-menu.module'
import { JwtModule } from '@nestjs/jwt'
import JWTConfiguration from './app-configs/configs/jwt.config'
import { AuthenticationModule } from './modules/authentication.module'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { UserModule } from './modules/user.module'
import { RootGuard } from './app-configs/guards/root.guard'
import { HealthCheckModule } from './modules/health-check.module'
import { ProductModule } from './modules/product.module'

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      load: [envConfiguration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useClass: JWTConfiguration,
    }),
    HttpModule,
    RichMenuModule,
    AuthenticationModule,
    UserModule,
    HealthCheckModule,
    ProductModule,
  ],
  providers: [
    CustomLogger,
    LineNotiyService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    { provide: APP_GUARD, useClass: RootGuard },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [CustomLogger],
})
export class AppModule {}
