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
      const productList = await this.productRepository.find({
        where: { active: true },
      });
      return productList;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findProductPId(pid) {
    try {
      const result = await this.productRepository.findOne({
        where: {
          id: pid,
        },
        relations: {
          user: true,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findProductsByPage(
    pageNum: number,
    limitNum: number,
  ): Promise<Product[] | null> {
    const limit = limitNum; //페이지 당 표시할 프로덕트 수
    const skip = (pageNum - 1) * limit; //스킵할 프로덕트 수
    try {
      const productList = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .leftJoinAndSelect(
          'bidding_Log',
          'biddingLog',
          'biddingLog.productId = product.id',
        )
        .select([
          'product.id as id',
          'product.name as name',
          'product.endTime as endTime',
          'product.nowPrice as nowPrice',
          'product.mainUrl as mainUrl',
          'product.active as active',
          'user.id as userId',
        ])
        .addSelect('COUNT(biddingLog.id) AS biddingCount')
        .where({ active: true })
        .groupBy('product.id')
        .limit(limit)
        .offset(skip)
        .getRawMany();

      // SELECT p.id, p.name, p.endTime, p.nowPrice, p.mainUrl, p.active, p.userId, count(b.id) as biddingCount
      // FROM product as p left outer join bidding_log as b on p.id = b.productId
      // WHERE p.active = true
      // group by p.id`);

      return productList;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findProductById(productId: number): Promise<Product | null> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.productFiles', 'productFile')
        .where({ id: productId })
        .getOne();

      const productBiddingInfo = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect(
          'bidding_Log',
          'biddingLog',
          'biddingLog.productId = product.id',
        )
        .where({ id: productId })
        .select('COUNT(biddingLog.id) AS biddingCount')
        .groupBy('product.id')
        .getRawOne();

      product['biddingCount'] = productBiddingInfo['biddingCount'];

      return product;
    } catch (error) {
      throw new HttpException(error, 400);
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

  async updateOwner({ queryRunner, pid, id }) {
    await queryRunner.manager.update(Product, pid, { owner: id });
  }
}
