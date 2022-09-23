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
      return productList;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findProductsByPage(pageNum: number): Promise<Product[] | null> {
    const limit = 8; //페이지 당 표시할 프로덕트 수
    const skip = (pageNum - 1) * limit; //스킵할 프로덕트 수
    try {
      const productList = await this.productRepository.find({
        skip: skip,
        take: limit,
      });
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
      throw new HttpException('db error', 400);
    }
  }
}
