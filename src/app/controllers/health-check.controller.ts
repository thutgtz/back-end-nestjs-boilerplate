import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SwaggerApiResponse } from '../../app-configs/decorators/response-swager-doc.decorator'

const prefix = 'health-check'

@ApiBearerAuth()
@ApiTags(prefix)
@Controller(prefix)
@Controller()
export class HealthCheckController {
  @Get('/v1')
  @SwaggerApiResponse()
  @ApiOperation({
    description: 'Enpoint health check',
  })
  async healthxCheck(): Promise<boolean> {
    return true
  }
}
