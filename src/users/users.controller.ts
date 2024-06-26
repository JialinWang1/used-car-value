import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dtos/update-user.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { UserEntity } from './user.entity'
import { AuthGuard } from 'src/guards/auth.guard'

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get('/getCurrentUser')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: UserEntity) {
    return user
  }

  @Post('/signout')
  signOut(@Session() session) {
    session.userId = null
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signUp(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('/signin')
  @HttpCode(200)
  async signInUser(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signIn(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(+id)
    if (!user) {
      throw new NotFoundException(`user with ID: ${id} not found`)
    }
    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body)
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
