import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAllProducts(): Promise<Product[] | null> {
    try {
      const productList = await this.productRepository.find({});
      return productList;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findProductById(productId: number): Promise<Product | null> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });
      return product;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async createPost(product) {
    try {
      const result = await this.productRepository.save(product);
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async updateMainURL(imgURLData, productId) {
    try {
      const result = await this.productRepository
        .createQueryBuilder('product')
        .update()
        .set({ mainUrl: imgURLData.imgURL })
        .where({ id: productId })
        .execute();
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
