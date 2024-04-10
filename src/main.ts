import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setUpApp } from './setup-app'
import { UserEntity } from './users/user.entity'

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setUpApp(app)
  await app.listen(3000)
}
bootstrap()
