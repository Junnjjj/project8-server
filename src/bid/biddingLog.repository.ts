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
}
