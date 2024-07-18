import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { catchError, lastValueFrom, map } from 'rxjs'
import { Configs } from '../../app-configs/configs/env.config'
import { LineAccessVerifyTokenRes } from './dto/line-access.verify-token.dto'

class LineEndpoint {
  private static baseUrl = 'https://api.line.me'

  static verifyTokenId = LineEndpoint.baseUrl + '/oauth2/v2.1/verify'
}

@Injectable()
export class LineAccessService {
  constructor(private httpService: HttpService, private configService: ConfigService<Configs>) {}

  private buildHeader() {
    return {
      Authorization: `Bearer ${this.configService.get('lineAccessToken')}`,
    }
  }

  async verifyTokenId(tokenId: string): Promise<LineAccessVerifyTokenRes> {
    const headers = this.buildHeader()
    headers['Content-Type'] = 'application/x-www-form-urlencoded'

    const params = new URLSearchParams()
    params.append('id_token', tokenId)
    params.append('client_id', this.configService.get('lineLoginChannelId'))

    return await lastValueFrom(
      this.httpService.post(LineEndpoint.verifyTokenId, params, { headers }).pipe(
        map((res) => res.data),
        catchError((error) => {
          throw error
        })
      )
    )
  }
}
