import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UsersRequestDto } from '../dto/user.request.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() body: UsersRequestDto) {
    console.log(body);
    return 'sigunUp';
  }

  @Post('login')
  logIn() {
    return 'login';
  }
}
