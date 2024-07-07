import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users.repository'
import { UserPermissionRepository } from '../repositories/user-permissions.repository'
import { User } from './domain/user.domain'
import { UserV1CreateReq } from '../controllers/dto/user.v1-create.dto'
import { Permission, PermissionEnum } from './domain/permission.domain'
import { PrismaService } from '../../utilities/prismaModule/prisma.service'
import { BussinessException } from '../../app-configs/interceptors/models/custom-response.model'
import { UserV1UpdateReq } from '../controllers/dto/user.v1-update.dto'

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private usersRepository: UsersRepository,
    private userPermissionRepository: UserPermissionRepository
  ) {}

  async createUser(body: UserV1CreateReq): Promise<void> {
    const isExist = await this.usersRepository.findOneByUsername(body.username)
    if (isExist) {
      throw new BussinessException('username already exist.')
    }

    const newUser = new User(body.username, body.password)
    const defaultPermission = Permission.FromPermissionEnumArray([PermissionEnum.READ_RICH_MENU])

    await this.prismaService.$transaction(async (transaction) => {
      await this.usersRepository.createOne(newUser, transaction)
      await this.userPermissionRepository.create(newUser.getId(), defaultPermission, transaction)
    })
  }

  async updateUser(body: UserV1UpdateReq): Promise<void> {
    const isExist = await this.usersRepository.findOneById(body.userId)
    if (isExist) {
      throw new BussinessException('user not found.')
    }

    const user = User.FromDb(isExist)
    user.updatePassword(body.password)

    await this.usersRepository.createOne(user)
  }
}
