import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { UsersRequestDto } from '../dto/user.request.dto';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/dto/login.request.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

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
  async logIn(@Body() body: LoginRequestDto, @Res() res: Response) {
    // email, password 일치하는지 확인 후 - jwt 토큰 생성
    const { AccessToken, RefreshToken } = await this.authService.jwtLogIn(body);

    // Set-Cookie 에 Refresh Token 저장, Cookie or Data에 Access Token 저장
    await this.userService.setCurrentRefreshToken(
      body.loginId,
      RefreshToken.refreshToken,
    );
    res.cookie('refreshToken', RefreshToken);

    return res.send({
      accessToken: AccessToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user, @Req() req: Request) {
    return user;
  }

  @Get('/cookies')
  getCookies(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.cookies['jwt'];
    return res.send(jwt);
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response): any {
    //쿠키 삭제
    this.authService.deleteJwtCookie(res);

    return res.send({
      message: 'logout successful',
    });
  }
}
