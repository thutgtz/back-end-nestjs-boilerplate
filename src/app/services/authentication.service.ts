import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users.repository'
import { BussinessException } from '../../app-configs/interceptors/models/custom-response.model'
import { AuthenticationV1LoginRes } from '../controllers/dto/authentication.v1-login.dto'
import { JwtService } from '@nestjs/jwt'
import { UserPermissionRepository } from '../repositories/user-permissions.repository'
import { jwtPayload } from '../../app-configs/guards/jwt.guard'
import { Password } from './domain/password.domian'
import { instanceToPlain } from 'class-transformer'
import { Permission } from './domain/permission.domain'

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    private userPermissionRepository: UserPermissionRepository
  ) {}

  async adminLogin(username: string, password: string): Promise<AuthenticationV1LoginRes> {
    const user = await this.usersRepository.findOneByUsername(username)
    if (!user) {
      throw new HttpException('user not found.', HttpStatus.UNAUTHORIZED)
    }
    if (!Password.FromHashPassword(user.hash_password).isEqual(Password.FromPlainPassword(password))) {
      throw new BussinessException('incorrect password')
    }

    const userPermissions = await this.userPermissionRepository.findByUserId(user.id)

    const payload = new jwtPayload()
    payload.permissions = Permission.FromUserPermissions(userPermissions).toStringArray()
    payload.userId = user.id

    const accessToken = await this.jwtService.signAsync(instanceToPlain(payload))

    const response = new AuthenticationV1LoginRes()
    response.accessToken = accessToken

    return response
  }
}
