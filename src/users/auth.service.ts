import { BinaryLike, scrypt as _scrypt, randomBytes } from 'crypto'
import { UsersService } from './users.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { promisify } from 'util'

const scrypt = promisify(_scrypt) as (password: BinaryLike, salt: BinaryLike, keylen: number) => Promise<Buffer>

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email)
    if (users.length) {
      throw new BadRequestException(`Email: ${email} in use`)
    }
    const salt = randomBytes(8).toString('hex')

    const hash = await scrypt(password, salt, 32)

    const result = `${salt}.${hash.toString('hex')}`

    return this.usersService.create(email, result)
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) {
      throw new NotFoundException(`User of email: ${email} not found.`)
    }

    const [salt, storedHash] = user.password.split('.')
    const hash = await scrypt(password, salt, 32)

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('bad don`t match')
    }
    return user
  }
}
