import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../product/product.repository';
import { BiddingLogRepository } from '../biddingLog.repository';
import { DataSource } from 'typeorm';
import { UserProfileRepository } from '../../user/userProfile.repository';
import { UserRepository } from '../../user/user.repository';
import { AlarmRepository } from '../../alarm/alarm.repository';

@Injectable()
export class BidService {
  constructor(
    private readonly biddingLogRepository: BiddingLogRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly alarmRepository: AlarmRepository,
    private dataSource: DataSource,
  ) {}

  async getBiddingLog(id) {
    const productId = id;

    return await this.biddingLogRepository.getBiddingLog(productId);
  }

  async createBiddingLog({ ProductId, body, user }) {
    const userId = user.id; // userId
    const { price, message, shipping } = body; // Body Data
    const productId = ProductId; // product Id

    // 1. 종료된 입찰인지 확인
    const checkActiveProduct = await this.productRepository.checkActiveById(
      productId,
    );
    if (!checkActiveProduct) {
      throw new HttpException('입찰이 종료된 상품입니다', 400);
    }

    //2. 자기 자신 물품인지 확인,
    const isProductSeller = await this.productRepository.checkProductUserById({
      productId,
      userId,
    });
    if (isProductSeller) {
      throw new HttpException('자신의 물품은 입찰할 수 없습니다', 400);
    }

    // 3. 이전 입찰이 자기 자신인지 확인
    const prevBidIsMine = await this.biddingLogRepository.checkPrevBiddingLog({
      productId,
      userId,
    });
    if (prevBidIsMine) {
      throw new HttpException('연달아 입찰하실 수 없습니다.', 400);
    }

    // 4. bidding 가격이 nowPrice 보다 큰지 확인
    const checkBiddingPrice = await this.productRepository.checkBiddingPrice({
      productId,
      biddingPrice: price,
    });
    if (!checkBiddingPrice) {
      throw new HttpException('앞선 입찰이 존재합니다.', 400);
    }

    // (추가-alarm) 앞선 입찰이 존재하면 => 앞선입찰 사용자에게 alarm 생성
    const prevBiddingUserId = await this.biddingLogRepository.prevBiddingUserId(
      { productId },
    );
    if (prevBiddingUserId) {
      await this.alarmRepository.createAlarm({
        productId,
        userId: prevBiddingUserId,
        type: 0,
      });
    }

    // (추가 - alarm) => product User에게 입찰된 사실 알리기.
    const productInfo = await this.productRepository.findProductPId(productId);
    const productUserId = productInfo.userId;
    await this.alarmRepository.createAlarm({
      productId,
      userId: productUserId,
      type: 4,
    });

    // 트랙잭션 형성
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 5. bidding log 에 저장
      const biddingLog = await this.biddingLogRepository.createBiddingLog({
        queryRunner,
        price,
        message,
        shipping,
        productId,
        userId,
      });

      // 6. product nowPrice 수정
      await this.productRepository.updateNowPrice({
        queryRunner,
        productId,
        price,
      });

      // 7. biddingProduct + 1
      const isBiddingProduct = await this.biddingLogRepository.isBiddingProduct(
        { productId, userId },
      );

      // 8.(입찰 중인 물건이 아닐때만)
      if (!isBiddingProduct) {
        const userProfile = await this.userRepository.findProfileId(userId);

        await this.userProfileRepository.plusBiddingProductCount({
          queryRunner,
          userProfile,
        });
      }

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
