import { Module } from '@nestjs/common'
import { PrismaModule } from '../utilities/prismaModule/prisma.module'
import { UserController } from '../app/controllers/user.controller'
import { UserService } from '../app/services/user.service'
import { UsersRepository } from '../app/repositories/users.repository'
import { UserPermissionRepository } from '../app/repositories/user-permissions.repository'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UsersRepository, UserPermissionRepository],
})
export class UserModule {}
