import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import { User } from '../entity/user.entity';
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

    this.convertInAuthorities(user);

    // 2. ID 값을 통해 access Token, Refresh Token 발급
    const AccessToken = this.getCookieWithJwtAccessToken(
      loginId,
      user.id,
      user.authorities,
    );
    const RefreshToken = this.getCookieWithJwtRefreshToken(user.id);

    return {
      AccessToken,
      RefreshToken,
    };
  }

  // Access Token - 30분
  getCookieWithJwtAccessToken(loginId: string, id: number, authorities: any) {
    const payload = { email: loginId, sub: id, authorities: authorities };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });

    return {
      token: token,
      options: {
        domain:
          process.env.MODE === 'DEV' ? 'localhost' : process.env.DOMAIN_URL,
        path: '/',
        httpOnly: true,
        maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) * 1000,
      },
    };
  }

  // Refresh Token - 7일
  getCookieWithJwtRefreshToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });

    return {
      token: token,
      options: {
        domain:
          process.env.MODE === 'DEV' ? 'localhost' : process.env.DOMAIN_URL,
        path: '/',
        httpOnly: true,
        maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000,
      },
    };
  }

  // accessToken 재발급
  async issueAJTByRJT(user, jwt) {
    const userId = user.id;
    const refreshToken = jwt;

    const userInfo = await this.userRepository.findUserById(userId);
    const hashedRefreshToken = userInfo.currentHashedRefreshToken;

    const isJWTValidated: boolean = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken,
    );

    if (!isJWTValidated) {
      throw new HttpException('적합한 사용자가 아닙니다.', 400);
    }

    const AccessToken = this.getCookieWithJwtAccessToken(
      user.email,
      user.id,
      user.authorities,
    );

    return AccessToken;
  }

  setJwtCookie(token, res) {
    res.cookie('refreshToken', token.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
  }

  deleteJwtCookie(res) {
    res.cookie('ajt', '', {
      domain: process.env.MODE === 'DEV' ? 'localhost' : process.env.DOMAIN_URL,
      path: '/',
      httpOnly: true,
      maxAge: 0,
    });

    res.cookie('rjt', '', {
      domain: process.env.MODE === 'DEV' ? 'localhost' : process.env.DOMAIN_URL,
      path: '/',
      httpOnly: true,
      maxAge: 0,
    });
  }

  private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach((authority) =>
        authorities.push({ name: authority.authorityName }),
      );
      user.authorities = authorities;
    }
    return user;
  }
}
