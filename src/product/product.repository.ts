import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
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
      console.log(productList);
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
      console.log('어디까지');
      const result = await this.productRepository.save(product);
      console.log('되니');
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
