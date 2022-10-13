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

  // 겹치는 입찰 물품인지
  async isBiddingProduct({ productId, userId }) {
    try {
      const result = await this.biddingLogRepository
        .createQueryBuilder('biddingLog')
        .where('productId = :productId', { productId: productId })
        .andWhere('userId = :userId', { userId: userId })
        .getMany();

      return result.length > 0 ? true : false;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  // 이전 입찰이 자기 자신인지 확인
  async checkPrevBiddingLog({ productId, userId }) {
    try {
      const biddingLog = await this.biddingLogRepository
        .createQueryBuilder('biddingLog')
        .leftJoinAndSelect('biddingLog.user', 'user')
        .where('productId = :productId', { productId: productId })
        .orderBy({ 'biddingLog.createdDate': 'DESC' })
        .getOne();

      if (!biddingLog) return false;
      return biddingLog.user.id === userId ? true : false;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  async getBiddingLog(productId) {
    try {
      const result = await this.biddingLogRepository
        .createQueryBuilder('biddingLog')
        // .leftJoinAndSelect('biddingLog.product', 'product')
        .where('productId = :productId', { productId: productId })
        .orderBy({ 'biddingLog.createdDate': 'ASC' })
        .getMany();
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
