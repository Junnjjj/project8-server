import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRequestDto } from '../dto/user.request.dto';
import { UserRepository } from '../user.repository';
import { UserProfileRepository } from '../userProfile.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async getUserProductData(id: number) {
    const isUserExist = await this.userRepository.findUserById(id);
    if (!isUserExist) {
      throw new HttpException('해당하는 유저가 존재하지 않습니다..', 401);
    }
    return await this.userRepository.findUserByIdWithoutPassword(id);
  }

  async signUp(body: UsersRequestDto) {
    const { loginId, passwd, name, tel1, tel2, tel3 } = body;
    const isUserExist = await this.userRepository.findUserByEmail(loginId);

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 유저는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(passwd, 12);

    const profile = await this.userProfileRepository.createProfile(tel1);

    const user = await this.userRepository.createUser({
      loginId,
      passwd: hashedPassword,
      name,
      profile: profile,
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
