import { Module } from '@nestjs/common'
import { HealthCheckController } from '../app/controllers/health-check.controller'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../utilities/prismaModule/prisma.module'
import JWTConfiguration from '../app-configs/configs/jwt.config'

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JWTConfiguration,
    }),
    PrismaModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class HealthCheckModule {}
