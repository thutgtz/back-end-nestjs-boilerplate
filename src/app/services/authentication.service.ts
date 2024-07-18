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
import { UserLineRepository } from '../repositories/user-line.repository'
import { LineAccessService } from '../external-services/line-access.service'
import { User } from './domain/user.domain'
import { AuthenticationV1LineAuthorizeRes } from '../controllers/dto/authentication.v1-line-authorize.dto'
import { randomInt } from 'crypto'
import { PrismaService } from '../../utilities/prismaModule/prisma.service'

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private lineAccessService: LineAccessService,
    private usersRepository: UsersRepository,
    private userPermissionRepository: UserPermissionRepository,
    private userLineRepository: UserLineRepository
  ) {}

  async adminLogin(citizenId: string, password: string): Promise<AuthenticationV1LoginRes> {
    const user = await this.usersRepository.findOneByCitizenId(citizenId)
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

  async lineAuthorize(lineTokenId: string): Promise<AuthenticationV1LineAuthorizeRes> {
    const result = await this.lineAccessService.verifyTokenId(lineTokenId).catch(() => {
      throw new Error('invalid id token.')
    })

    const isExist = await this.userLineRepository.findOneByLineId(result.sub)
    if (!isExist) throw new HttpException('this line account not linked yet.', HttpStatus.NOT_FOUND)

    const payload = new jwtPayload()
    payload.permissions = []
    payload.userId = isExist.user_id

    const accessToken = await this.jwtService.signAsync(instanceToPlain(payload))

    const response = new AuthenticationV1LineAuthorizeRes()
    response.accessToken = accessToken

    return response
  }

  async lineLinkAccount(lineTokenId: string, citizenId: string): Promise<void> {
    const findUser = await this.usersRepository.findOneByCitizenId(citizenId)
    if (!findUser) throw new BussinessException('user not found with giving citizenId')

    const result = await this.lineAccessService.verifyTokenId(lineTokenId).catch(() => {
      throw new Error('invalid id token.')
    })

    const user = User.FromDb(findUser)

    const [isLinkUserId, isLinkLineId] = await Promise.all([
      this.userLineRepository.findOneByLineId(result.sub),
      this.userLineRepository.findOneByUserId(user.getId()),
    ])

    if (isLinkUserId || isLinkLineId) throw new BussinessException('lineId / userId already linked.')
    await this.userLineRepository.createOne(user, result.sub)
  }

  async lineCreateAccount(lineTokenId: string): Promise<void> {
    const result = await this.lineAccessService.verifyTokenId(lineTokenId).catch(() => {
      throw new Error('invalid id token.')
    })

    const isLinkLineId = await this.userLineRepository.findOneByLineId(result.sub)
    if (isLinkLineId) throw new BussinessException('lineId already linked.')

    const user = new User(result.name, randomInt(100000).toString())

    await this.prismaService.$transaction(async (transaction) => {
      await this.usersRepository.createOne(user, transaction)
      await this.userLineRepository.createOne(user, result.sub, transaction)
    })
  }
}
