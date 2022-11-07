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

  async enrollFavorite({ userId, productId }) {
    try {
      const result = await this.productFavoriteRepository.create({
        user: userId,
        product: productId,
      });
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
