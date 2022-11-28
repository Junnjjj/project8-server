import { Module } from '@nestjs/common';
import { FavoriteController } from './controller/favorite.controller';
import { FavoriteService } from './service/favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFavorite } from '../entity/productFavorite.entity';
import { PFavoriteRepository } from './PFavorite.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([ProductFavorite])],
  providers: [FavoriteService, PFavoriteRepository],
  controllers: [FavoriteController],
  exports: [FavoriteService, PFavoriteRepository],
})
export class FavoriteModule {}
