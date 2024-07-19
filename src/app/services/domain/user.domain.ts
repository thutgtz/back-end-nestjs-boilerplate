import { $Enums, record_status as RecordStatus, users as Users } from '@prisma/client'
import { Password } from './password.domian'
import { randomUUID } from 'crypto'

export class User {
  private id: string
  private name: string
  private status: $Enums.record_status
  private updatedAt: Date
  private createdAt: Date
  private hashPassword: Password
  private citizenId?: string

  constructor(name: string, plainPassword: string, citizenId?: string) {
    this.id = randomUUID()
    this.name = name
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.status = RecordStatus.ACTIVE
    this.hashPassword = Password.FromPlainPassword(plainPassword)
    this.citizenId = citizenId
  }

  static FromDb(users: Users): User {
    const user = new User('', '')
    user.id = users.id
    user.name = users.name
    user.createdAt = users.created_at
    user.updatedAt = users.updated_at
    user.status = users.status
    user.hashPassword = Password.FromHashPassword(users.hash_password)
    return user
  }

  toDb(): Users {
    return {
      id: this.id,
      name: this.name,
      hash_password: this.hashPassword.toString(),
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      status: this.status,
      citizen_id: this.citizenId,
    }
  }

  getId(): string {
    return this.id
  }

  updateName(name: string) {
    this.name = name
    this.updatedAt = new Date()
  }
  updatePassword(plainPassword: string) {
    this.hashPassword = Password.FromPlainPassword(plainPassword)
    this.updatedAt = new Date()
  }
  updateStatusToClose() {
    this.status = RecordStatus.INACTIVE
    this.updatedAt = new Date()
  }
  updateCitizenId(citizenId: string) {
    this.citizenId = citizenId
    this.updatedAt = new Date()
  }
}
