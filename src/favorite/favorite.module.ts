import { Module } from '@nestjs/common';
import { FavoriteController } from './controller/favorite.controller';
import { FavoriteService } from './service/favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFavorite } from '../entity/productFavorite.entity';
import { PFavoriteRepository } from './PFavorite.repository';
import { ProductModule } from '../product/product.module';
import { NCFavoriteRepository } from './NCFavorite.repository';
import { NewsCommentFavorite } from '../entity/newsCommentFavorite.entity';
import { NFavoriteRepository } from './NFavorite.repository';
import { NewsFavorite } from '../entity/NewsFavorite.entity';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forFeature([
      ProductFavorite,
      NewsCommentFavorite,
      NewsFavorite,
    ]),
  ],
  providers: [
    FavoriteService,
    PFavoriteRepository,
    NCFavoriteRepository,
    NFavoriteRepository,
  ],
  controllers: [FavoriteController],
  exports: [
    FavoriteService,
    PFavoriteRepository,
    NCFavoriteRepository,
    NFavoriteRepository,
  ],
})
export class FavoriteModule {}
