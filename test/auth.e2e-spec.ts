import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../src/app.module'
import { setUpApp } from 'src/setup-app'

describe('Authentication System (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    setUpApp(app)
    await app.init()
  })

  it('handles a sign up request', () => {
    const email = 'e2e4@test.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual(email)
      })
  })

  it('signup as a new user then get the currently logged user', async () => {
    const email = 'e2e@test.com'

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201)

    const cookie = res.get('Set-Cookie')
    const { body } = await request(app.getHttpServer())
      .get('/auth/getCurrentUser')
      .set('Cookie', cookie)
      .expect(200)

    expect(body.email).toEqual(email)
  })
})
