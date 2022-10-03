import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BiddingLog } from '../entity/biddingLog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BiddingLogRepository {
  constructor(
    @InjectRepository(BiddingLog)
    private biddingLogRepository: Repository<BiddingLog>,
  ) {}

  async createBiddingLog({
    queryRunner,
    price,
    message,
    shipping,
    productId,
    userId,
  }) {
    const result = await queryRunner.manager.save(BiddingLog, {
      price,
      message,
      shipping,
      product: productId,
      user: userId,
    });
    return result;
  }

  async isBiddingProduct({ productId, userId }) {
    try {
      const result = await this.biddingLogRepository
        .createQueryBuilder('biddingLog')
        .where('productId = :productId', { productId: productId })
        .andWhere('userId = :userId', { userId: userId })
        .getMany();

      return result.length > 1 ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
