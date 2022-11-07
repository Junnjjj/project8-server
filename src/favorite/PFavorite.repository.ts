import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFavorite } from '../entity/productFavorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PFavoriteRepository {
  constructor(
    @InjectRepository(ProductFavorite)
    private productFavoriteRepository: Repository<ProductFavorite>,
  ) {}

  async enrollFavorite({ userId, productId }): Promise<ProductFavorite> {
    try {
      const result = await this.productFavoriteRepository.save({
        user: userId,
        product: productId,
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async checkExistFavorite({ productId, userId }): Promise<boolean> {
    try {
      const favorites = await this.productFavoriteRepository
        .createQueryBuilder('productFavorite')
        .where('productId = :productId', { productId: productId })
        .andWhere('userId = :userId', { userId: userId })
        .getOne();

      return favorites ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async deleteFavorite({ productId, userId }) {
    try {
      const favorites = await this.productFavoriteRepository
        .createQueryBuilder('productFavorite')
        .delete()
        .where('productId = :productId', { productId: productId })
        .andWhere('userId = :userId', { userId: userId })
        .execute();

      const response = { message: 'delete favorite success', code: '200' };
      return response;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
