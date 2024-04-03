import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password })
    console.log(user)
    return this.repo.save(user)
  }

  async findOneById(id: number) {
    if (!id) return null
    const user = await this.repo.findOneBy({ id })
    if (!user) {
      throw new NotFoundException(`user with ID: ${id} not found`)
    }
    return user
  }

  find(email: string) {
    console.log(email)
    return this.repo.findBy({ email })
  }

  async update(id: number, options: Partial<UserEntity>) {
    const user = await this.repo.findOneBy({ id })
    console.log('update: ' + user)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return this.repo.save({ ...user, ...options })
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id })
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return this.repo.remove(user)
  }
}
