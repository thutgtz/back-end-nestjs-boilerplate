import { $Enums, users } from '@prisma/client'

export class UserCreateModel implements users {
  id: string
  hash_password: string
  created_at: Date
  status: $Enums.record_status
  updated_at: Date
  username: string
}
