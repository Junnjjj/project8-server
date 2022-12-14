import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { NewsService } from '../service/news.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { RolesGuard } from '../../auth/role/roles.guard';
import { RoleType } from '../../auth/role-types';
import { Roles } from '../../common/decorators/role.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  createNews(@Body() body, @Req() req) {
    const role_admin = req.user.authorities.filter(
      (item) => item.authorityName === 'ROLE_ADMIN',
    );

    return this.newsService.createNews(body, role_admin[0]);
  }
}
