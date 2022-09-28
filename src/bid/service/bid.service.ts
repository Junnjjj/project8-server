import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../product/product.repository';
import { BiddingLogRepository } from '../biddingLog.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class BidService {
  constructor(
    private readonly biddingLogRepository: BiddingLogRepository,
    private readonly productRepository: ProductRepository,
    private dataSource: DataSource,
  ) {}

  async createBiddingLog({ ProductId, body, user }) {
    const userId = user.id; // userId
    const { price, message, shipping } = body; // Body Data
    const productId = ProductId; // product Id

    // 1. 종료된 입찰인지 확인
    const checkActiveProduct = await this.productRepository.checkActiveById(
      productId,
    );
    if (!checkActiveProduct) {
      throw new HttpException('입찰이 종료된 상품입니다', 401);
    }

    // 2. bidding 가격이 nowPrice 보다 큰지 확인
    const checkBiddingPrice = await this.productRepository.checkBiddingPrice({
      productId,
      biddingPrice: price,
    });
    if (!checkBiddingPrice) {
      throw new HttpException('앞선 입찰이 존재합니다.', 401);
    }

    // todo: user_info 도 추가
    // 3,4 트랙잭션 형성
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 3. bidding log 에 저장
      const biddingLog = await this.biddingLogRepository.createBiddingLog({
        queryRunner,
        price,
        message,
        shipping,
        productId,
        userId,
      });

      // 4. product nowPrice 수정
      await this.productRepository.updateNowPrice({
        queryRunner,
        productId,
        price,
      });

      await queryRunner.commitTransaction();
      return biddingLog;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(`트랜잭션 에러가 발생`, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
