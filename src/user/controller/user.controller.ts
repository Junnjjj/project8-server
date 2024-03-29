import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Param,
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

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user, @Req() req: Request) {
    return user;
  }

  @Post('signup')
  async signUp(@Body() body: UsersRequestDto) {
    return this.userService.signUp(body);
  }

  @Post('login')
  async logIn(@Body() body: LoginRequestDto, @Res() res: Response) {
    // email, password 일치하는지 확인 후 - jwt 토큰 생성
    const { AccessToken, RefreshToken } = await this.authService.jwtLogIn(body);

    // User DB 에 Refresh Token 저장
    await this.userService.setCurrentRefreshToken(
      body.loginId,
      RefreshToken.token,
    );

    // Set-Cookie 에 AccessToken, Refresh Token 저장
    // res.header('Access-Control-Allow-Headers', process.env.FRONT_URL);
    res.cookie('ajt', AccessToken.token, AccessToken.options);
    res.cookie('rjt', RefreshToken.token, RefreshToken.options);

    return res.send({
      message: 'loginSuccess',
    });
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response, @CurrentUser() user) {
    // DB에 Refresh Token 삭제
    await this.userService.deleteRefreshToken(user.loginId);

    //Client 쿠키 삭제
    this.authService.deleteJwtCookie(res);

    return res.send({
      message: 'logout successful',
    });
  }

  // accessToken refresh
  @Get('/refresh-token')
  @UseGuards(JwtAuthGuard)
  async getCookies(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() user,
  ) {
    const jwt = req.cookies['rjt'];

    const accessToken = await this.authService.issueAJTByRJT(user, jwt);

    res.cookie('ajt', accessToken.token, accessToken.options);
    return res.send({
      message: 'refresh Success',
    });
  }

  @Get('/:id')
  getUserProductData(@Param('id') id: number) {
    return this.userService.getUserProductData(id);
  }
}
