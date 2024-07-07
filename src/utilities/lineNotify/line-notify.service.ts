import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as querystring from 'querystring'
import fetch, { Headers } from 'node-fetch'
import { Configs } from '../../app-configs/configs/env.config'

@Injectable()
export class LineNotiyService {
  private token: string
  constructor(private configService: ConfigService<Configs>) {
    this.token = configService.get('lineNotifyToken')
  }

  async sendNoti(message: string) {
    // if (this.configService.get('nodeEnv') === 'develop') return

    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.token}`)
    headers.append('Content-Type', `application/x-www-form-urlencoded`)
    await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers,
      body: querystring.stringify({ message }) as any,
    }).catch((e) => console.log(e))
  }
}
