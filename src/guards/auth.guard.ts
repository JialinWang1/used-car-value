import { CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Observable } from 'rxjs'

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const {
      session: { userId }
    } = context.switchToHttp().getRequest()
    if (!userId) {
      throw new ForbiddenException('fuck you')
    }
    return userId
  }
}
