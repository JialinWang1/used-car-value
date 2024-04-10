import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { NotFoundException } from '@nestjs/common'

describe('UsersController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => Promise.resolve([{ id: 1, email, password: '123456' }]),
      findOneById: (id: number) => Promise.resolve({ id, email: 'test@test.com', password: '123456' })
      // remove: () => {},
      // update: () => {}
    }
    fakeAuthService = {
      signIn: (email: string, password: string) => Promise.resolve({ id: 1, email, password })
      // signUp: () => {}
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('findAllUsers returns a list of user with given email', async () => {
    const email = 'test@test.com'
    const users = await controller.findAllUsers(email)
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual(email)
  })

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1')
    expect(user).toBeDefined()
  })

  it('findUser with given id not found', async () => {
    fakeUsersService.findOneById = () => null
    expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  })

  it('sign in updates session object and returns user', async () => {
    const session = { userId: 0 }
    const user = await controller.signInUser(
      {
        email: 'test@test.com',
        password: '123456'
      },
      session
    )

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
})
