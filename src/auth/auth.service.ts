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

    // 1. Email, Password 일치하는지 확인
    const user = await this.userRepository.findUserByEmail(loginId);

    if (!user) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      passwd,
      user.passwd,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // 2. ID 값을 통해 access Token, Refresh Token 발급
    const AccessToken = this.getCookieWithJwtAccessToken(loginId, user.id);
    const RefreshToken = this.getCookieWithJwtRefreshToken(user.id);

    // 3. User DB 에 저장

    // Set-Cookie 에 Refresh Token 저장, Cookie or Data에 Access Token 저장

    // const payload = { email: loginId, sub: user.id };

    return {
      // token: this.jwtService.sign(payload),
      AccessToken,
      RefreshToken,
    };
  }

  // Access Token - 30분
  getCookieWithJwtAccessToken(loginId: string, id: number) {
    const payload = { email: loginId, sub: id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });

    return token;
  }

  // Refresh Token - 7일
  getCookieWithJwtRefreshToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });

    return {
      accessToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000,
    };
  }

  setJwtCookie(token, res) {
    res.cookie('refreshToken', token.token, {
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
