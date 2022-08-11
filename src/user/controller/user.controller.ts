import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UsersRequestDto } from '../dto/user.request.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() body: UsersRequestDto) {
    return this.userService.signUp(body);
  }

  @Post('login')
  logIn(@Body() body) {
    return 'login';
  }
}
