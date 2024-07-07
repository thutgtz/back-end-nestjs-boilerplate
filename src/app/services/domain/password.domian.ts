import { createHash } from 'crypto'

export class Password {
  private hashPassword: string

  static FromPlainPassword(plainPassword: string): Password {
    const password = new Password()
    password.hashPassword = createHash('md5').update(Buffer.from(plainPassword)).digest('hex')

    return password
  }

  static FromHashPassword(hashPassword: string): Password {
    const password = new Password()
    password.hashPassword = hashPassword

    return password
  }

  isEqual(password: Password): boolean {
    return this.hashPassword === password.hashPassword
  }

  toString(): string {
    return this.hashPassword
  }
}
