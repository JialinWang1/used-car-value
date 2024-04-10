import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { Observable, map } from 'rxjs'

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        })
      })
    )
  }
}
