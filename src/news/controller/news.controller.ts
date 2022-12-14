import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
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

  @Post('upload/:imgName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  uploadNewsImg(
    @Param('imgName') imgName: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.newsService.saveNewsImg(files[0], imgName);
  }
}
