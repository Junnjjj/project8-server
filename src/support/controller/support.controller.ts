import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
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

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}
  @Get('/notice')
  getAllnotice() {
    return;
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
}
