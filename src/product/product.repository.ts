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
      // const productList = await this.productRepository.find({
      //   select: {
      //     id: true,
      //     name: true,
      //     description: true,
      //     endTime: true,
      //     bidUnit: true,
      //     nowPrice: true,
      //     startPrice: true,
      //     endHour: true,
      //     mainUrl: true,
      //     active: true,
      //     user: {
      //       id: true,
      //       createdDate: false,
      //       loginId: false,
      //       passwd: false,
      //       name: false,
      //       currentHashedRefreshToken: false,
      //     },
      //   },
      //   where: { active: true },
      //   relations: { user: true },
      // });

      const productList = await this.productRepository.query(`
                SELECT p.id, p.name, p.endTime, p.nowPrice, p.endTime, p.mainUrl, p.active, p.userId, count(b.id) as biddingCount
                FROM product as p left outer join bidding_log as b on p.id = b.productId
                WHERE p.active = true
                group by p.id`);
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
        relations: {
          productFiles: true,
        },
      });
      return product;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async createPost(queryRunner, product) {
    return await queryRunner.manager.save(Product, product);
  }

  async updateMainURL(queryRunner, imgURLData, productId) {
    return queryRunner.manager.update(Product, productId, {
      mainUrl: imgURLData.imgURL,
    });
  }

  async checkActiveById(productId) {
    try {
      const result = await this.productRepository
        .createQueryBuilder('product')
        .where('id = :id', { id: productId })
        .getOne();

      return result.active;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async checkProductUserById({ productId, userId }) {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: {
          user: true,
        },
      });

      return product.user.id === userId ? true : false;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async checkBiddingPrice({ productId, biddingPrice }) {
    try {
      const query = await this.productRepository
        .createQueryBuilder('product')
        .where('id = :id', { id: productId })
        .getOne();
      const nowPrice = Number(query.nowPrice);

      const result = Number(nowPrice) < Number(biddingPrice);
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async updateNowPrice({ queryRunner, productId, price }) {
    await queryRunner.manager.update(Product, productId, { nowPrice: price });
  }

  async updateActiveToFalse(id) {
    try {
      await this.productRepository.update(id, { active: false });
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
