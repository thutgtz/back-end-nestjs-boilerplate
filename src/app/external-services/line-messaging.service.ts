import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosError } from 'axios'
import { catchError, lastValueFrom, map, of } from 'rxjs'
import { Configs } from '../../app-configs/configs/env.config'

class LineEndpoint {
  private static baseUrl = 'https://api.line.me'

  static createRichMenu = LineEndpoint.baseUrl + '/v2/bot/richmenu'
  static getDefaultRichMenu = LineEndpoint.baseUrl + '/v2/bot/user/all/richmenu'
}

@Injectable()
export class LineMessagingService {
  constructor(private httpService: HttpService, private configService: ConfigService<Configs>) {}

  private buildHeader() {
    return {
      Authorization: `Bearer ${this.configService.get('lineAccessToken')}`,
    }
  }

  async createRichMenu() {
    const body = {}
    return new Promise((reslove) => {
      this.httpService.post(LineEndpoint.createRichMenu, body, { headers: this.buildHeader() }).pipe(
        map(reslove),
        catchError((error) => {
          throw error
        })
      )
    })
  }

  async getDefaulteRichMenu() {
    return await lastValueFrom(
      this.httpService.get(LineEndpoint.getDefaultRichMenu, { headers: this.buildHeader() }).pipe(
        map((res) => res),
        catchError((e: AxiosError) => {
          if (e.response.status === HttpStatus.NOT_FOUND) return of([])
          throw e
        })
      )
    )
  }
}
