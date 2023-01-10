import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { SupportService } from '../service/support.service';
import { RolesGuard } from '../../auth/role/roles.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleType } from '../../auth/role-types';
import { NoticeRequestDto } from '../dto/notice.request.dto';
import { InquiryRequestDto } from '../dto/inquiry.request.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../../entity/user.entity';
import { IAnswerRequestDto } from '../dto/iAnswer.request.dto';
import { Notice } from '../../entity/notice.entity';
import { Inquiry } from '../../entity/inquiry.entity';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('/notice')
  async showAllNotice(): Promise<Notice[] | null> {
    return this.supportService.findAllNotice();
  }

  @Get('/inquiry')
  async showAllInquiry(): Promise<Inquiry[] | null> {
    return this.supportService.findAllInquiry();
  }

  @Post('/notice')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  createNotice(@Body() body: NoticeRequestDto, @Req() req) {
    const role_admin = req.user.authorities.filter(
      (item) => item.authorityName == 'ROLE_ADMIN',
    );

    return this.supportService.createNotice(body, role_admin[0]);
  }

  @Patch('/notice/?')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  updateNotice(
    @Query('nid') nid: number,
    @Body() body: NoticeRequestDto,
    @Req() req,
  ) {
    const role_admin = req.user.authorities.filter(
      (item) => item.authorityName == 'ROLE_ADMIN',
    );

    return this.supportService.updateNotice(nid, body, role_admin[0]);
  }

  @Delete('/notice/?')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  deleteNotice(@Query('nid') nid: number, @Req() req) {
    const role_admin = req.user.authorities.filter(
      (item) => item.authorityName == 'ROLE_ADMIN',
    );

    return this.supportService.deleteNotice(nid, role_admin[0]);
  }

  @Post('/inquiry')
  @UseGuards(JwtAuthGuard)
  createInquiry(@Body() body: InquiryRequestDto, @CurrentUser() user: User) {
    return this.supportService.createInquiry(body, user);
  }

  @Post('/iAnswer/?')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  createAnswer(
    @Query('iid') iid: number,
    @Body() body: IAnswerRequestDto,
    @Req() req,
  ) {
    const role_admin = req.user.authorities.filter(
      (item) => item.authorityName == 'ROLE_ADMIN',
    );

    return this.supportService.createAnswer(iid, body, role_admin[0]);
  }
}
