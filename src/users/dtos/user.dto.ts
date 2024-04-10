import { Expose } from 'class-transformer'

export class UserDto {
  @Expose()
  id: number

  @Expose()
  administrator: boolean

  @Expose()
  email: string
}
