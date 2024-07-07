import { Module } from '@nestjs/common'
import { RichMenuController } from '../app/controllers/rich-menu.controller'
import { RichMenuService } from '../app/services/rich-menu.service'
import { LineMessagingService } from '../app/external-services/line-messaging.service'
import { PrismaModule } from '../utilities/prismaModule/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [RichMenuController],
  providers: [LineMessagingService, RichMenuService],
})
export class RichMenuModule {}
