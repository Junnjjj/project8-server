import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from '../service/news.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { RolesGuard } from '../../auth/role/roles.guard';
import { RoleType } from '../../auth/role-types';
import { Roles } from '../../common/decorators/role.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multer.options';
import { News } from '../../entity/news.entity';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../../entity/user.entity';

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
  @UseInterceptors(FilesInterceptor('image', 5, multerOptions(`news`)))
  uploadNewsImg(
    @Param('imgName') imgName: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.newsService.saveNewsImg(files[0], imgName);
  }

  @Get('/search/?')
  searchNews(@Query('value') value: string) {
    return this.newsService.searchNews(value);
  }

  @Get('/findByFilter/?')
  showNewsByPage(@Query('page') page: number, @Query('limit') limit: number) {
    return this.newsService.showNewsByPage(page, limit);
  }

  @Get('/length')
  getNewsLength() {
    return this.newsService.getNewsLength();
  }

  @Post('/comment/:nid')
  @UseGuards(JwtAuthGuard)
  createNewsComment(
    @Param('nid') nid: number,
    @CurrentUser() user: User,
    @Body() body,
  ) {
    return this.newsService.createComment(body, user, nid);
  }

  @Get('/comment/:nid')
  getNewsComments(@Param('nid') nid: number) {
    return this.newsService.getComments(nid);
  }

  @Delete('/comment/:cid')
  @UseGuards(JwtAuthGuard)
  deleteComment(@CurrentUser() user: User, @Param('cid') cid: number) {
    return this.newsService.deleteComment({ user, cid });
  }

  @Get(':id')
  showNews(@Param('id') id: number): Promise<News> {
    return this.newsService.showOneNews(id);
  }
}
