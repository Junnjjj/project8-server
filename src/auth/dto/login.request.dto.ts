import { User } from '../../user/user.entity';
import { PickType } from '@nestjs/swagger';

export class LoginRequestDto extends PickType(User, [
  'loginId',
  'passwd',
] as const) {}
