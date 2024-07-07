import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SwaggerApiResponse } from '../../app-configs/decorators/response-swager-doc.decorator'
import { RichMenuService } from '../services/rich-menu.service'
import { RequireAuthorize } from '../../app-configs/decorators/require-authorize.decorator'
import { RequirePermissions } from '../../app-configs/decorators/require-permissions.decorator'
import { PermissionEnum } from '../services/domain/permission.domain'

const prefix = 'line-messaging'

@ApiBearerAuth()
@ApiTags(prefix)
@Controller(prefix)
@Controller()
export class RichMenuController {
  constructor(private richMenuService: RichMenuService) {}

  @Get('/v1/rich-menu')
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint สำหรับดึงข้อมูล rich menu',
  })
  @RequireAuthorize()
  @RequirePermissions([PermissionEnum.READ_RICH_MENU])
  async createRichMenu(): Promise<any> {
    return this.richMenuService.getDefaulteRichMenu()
  }
}
