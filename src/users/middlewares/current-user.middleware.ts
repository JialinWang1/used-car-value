import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UsersService } from '../users.service'

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const { userId } = req.session || {}
    if (userId) {
      const user = await this.usersService.findOneById(userId)
      req.currentUser = user
    }
    next()
  }
}
