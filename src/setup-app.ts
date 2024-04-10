import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import cookieSession from 'cookie-session'

export const setUpApp = (app: INestApplication<any>) => {
  const configService = app.get(ConfigService)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  app.use(
    cookieSession({
      keys: [configService.get('COOKIE_KEY')]
    })
  )
}
