import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRequestDto } from '../dto/user.request.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(body: UsersRequestDto) {
    const { loginId, passwd, name, tel1, tel2, tel3 } = body;
    const isUserExist = await this.userRepository.findUserByEmail(loginId);

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 유저는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(passwd, 12);

    const user = await this.userRepository.createUser({
      loginId,
      passwd: hashedPassword,
      name,
      tel1,
      tel2,
      tel3,
    });
    return user;
  }

  async setCurrentRefreshToken(loginId: string, token: string) {
    await this.userRepository.setRefreshToken(loginId, token);
  }

  async deleteRefreshToken(loginId: string) {
    await this.userRepository.deleteToken(loginId);
  }
}
