import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { loginId, passwd } = data;

    // 해당하는 이메일이 있는지
    const user = await this.userRepository.findUserByEmail(loginId);

    if (!user) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    //password가 일치하는지
    const isPasswordValidated: boolean = await bcrypt.compare(
      passwd,
      user.passwd,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: loginId, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  setJwtCookie(token, res) {
    res.setHeader('Authorization', 'Bearer ' + token.token);
    res.cookie('jwt', token.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
  }

  deleteJwtCookie(res) {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
  }
}
