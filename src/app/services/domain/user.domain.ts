import { $Enums, record_status as RecordStatus, users as Users } from '@prisma/client'
import { Password } from './password.domian'
import { randomUUID } from 'crypto'

export class User {
  private id: string
  private status: $Enums.record_status
  private updatedAt: Date
  private createdAt: Date
  private hashPassword: Password
  private username: string

  constructor(username: string, plainPassword: string) {
    this.id = randomUUID()
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.status = RecordStatus.ACTIVE
    this.hashPassword = Password.FromPlainPassword(plainPassword)
    this.username = username
  }

  static FromDb(users: Users): User {
    const user = new User(null, null)
    user.id = randomUUID()
    user.createdAt = users.created_at
    user.updatedAt = users.updated_at
    user.status = users.status
    user.hashPassword = Password.FromHashPassword(users.hash_password)
    user.username = users.username
    return user
  }

  toDb(): Users {
    return {
      id: this.id,
      hash_password: this.hashPassword.toString(),
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      status: this.status,
      username: this.username,
    }
  }

  getId(): string {
    return this.id
  }

  updatePassword(plainPassword: string) {
    this.hashPassword = Password.FromPlainPassword(plainPassword)
    this.updatedAt = new Date()
  }
  updateStatusToClose() {
    this.status = RecordStatus.INACTIVE
    this.updatedAt = new Date()
  }
}
