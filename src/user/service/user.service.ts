import { Injectable } from '@nestjs/common';
import { UsersRequestDto } from '../dto/user.request.dto';

@Injectable()
export class UserService {
  signUp(body: UsersRequestDto) {}
}
