import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Configs } from '../../app-configs/configs/env.config'
import { LineMessagingService } from '../external-services/line-messaging.service'

@Injectable()
export class RichMenuService {
  constructor(private configService: ConfigService<Configs>, private lineMessagingService: LineMessagingService) {}

  async getDefaulteRichMenu() {
    return this.lineMessagingService.getDefaulteRichMenu()
  }
}
