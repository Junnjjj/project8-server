import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FavoriteService } from '../service/favorite.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../../entity/user.entity';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // Product Favorite 추가
  @UseGuards(JwtAuthGuard)
  @Get(':pid')
  enrollFavorite(@CurrentUser() user: User, @Param('pid') pid: number) {
    return this.favoriteService.enrollProductFavorite({ user, pid });
  }

  // News Favorite 추가
  @Get('/news/:nid')
  @UseGuards(JwtAuthGuard)
  enrollNFavorite(@CurrentUser() user: User, @Param('nid') nid: number) {
    return this.favoriteService.enrollNFavorite({ user, nid });
  }

  // News Comment Favorite 추가
  @Get('/news/comment/:cid')
  @UseGuards(JwtAuthGuard)
  enrollNCFavorite(@CurrentUser() user: User, @Param('cid') cid: number) {
    return this.favoriteService.enrollNCFavorite({ user, cid });
  }
}
