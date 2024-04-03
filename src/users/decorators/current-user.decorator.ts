import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const CurrentUser = createParamDecorator((_data, input: ExecutionContext) => {
  const request = input.switchToHttp().getRequest()
  return request.currentUser
})
