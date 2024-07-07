import { SetMetadata } from '@nestjs/common'

export const ROOT_ONLY = 'ROOT_ONLY'
export const RootOnly = () => SetMetadata(ROOT_ONLY, true)
