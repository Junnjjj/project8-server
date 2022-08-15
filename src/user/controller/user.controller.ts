import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UsersRequestDto } from '../dto/user.request.dto';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/dto/login.request.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: UsersRequestDto) {
    return this.userService.signUp(body);
  }

  @Post('login')
  logIn(@Body() body: LoginRequestDto) {
    return this.authService.jwtLogIn(body);
  }
}
