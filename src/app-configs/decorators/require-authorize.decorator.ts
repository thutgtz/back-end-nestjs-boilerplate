import { SetMetadata } from '@nestjs/common'

export const IS_REQUIRE_AUTH = 'IS_REQUIRE_AUTH'
export const RequireAuthorize = () => SetMetadata(IS_REQUIRE_AUTH, true)
