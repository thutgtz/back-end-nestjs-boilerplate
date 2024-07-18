import { Module } from '@nestjs/common'
import { AuthenticationController } from '../app/controllers/authentication.controller'
import { UserPermissionRepository } from '../app/repositories/user-permissions.repository'
import { UsersRepository } from '../app/repositories/users.repository'
import { AuthenticationService } from '../app/services/authentication.service'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../utilities/prismaModule/prisma.module'
import JWTConfiguration from '../app-configs/configs/jwt.config'
import { UserLineRepository } from '../app/repositories/user-line.repository'
import { LineAccessService } from '../app/external-services/line-access.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JWTConfiguration,
    }),
    PrismaModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LineAccessService, UsersRepository, UserPermissionRepository, UserLineRepository],
})
export class AuthenticationModule {}
