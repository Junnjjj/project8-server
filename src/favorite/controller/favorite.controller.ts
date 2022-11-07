import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FavoriteService } from '../service/favorite.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // Product Favorite 추가
  @UseGuards(JwtAuthGuard)
  @Get(':pid')
  enrollFavorite(@CurrentUser() user, @Param('pid') pid: number) {
    return this.favoriteService.enrollProductFavorite({ user, pid });
  }
}
