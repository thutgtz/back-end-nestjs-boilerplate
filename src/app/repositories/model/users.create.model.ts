import { $Enums, users } from '@prisma/client'

export class UserReportModel {
  id: string
  hash_password: string
  created_at: Date
  status: $Enums.record_status
  updated_at: Date
  username: string
}
