import { HttpException, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ProductRepository } from '../../product/product.repository';
import { UserProfileRepository } from '../../user/userProfile.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../user/user.repository';
import { BiddingLogRepository } from '../../bid/biddingLog.repository';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly productRepository: ProductRepository,
    private readonly biddingLogRepository: BiddingLogRepository,
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(CronService.name);

  async addBiddingEndCronJob(pid: string, endDate: Date) {
    const job = new CronJob(endDate, async () => {
      this.logger.debug(`(${pid} 경매 종료. 종료 시간: ${endDate}`);
      // 1. product의 active를 false로 설정
      await this.productRepository.updateActiveToFalse(pid);

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // 2. product 판매자의 onSaleProduct -1
        const product = await this.productRepository.findProductPId(pid);
        const userId = product.user.id;
        const userProfile = await this.userRepository.findProfileId({ userId });

        await this.userProfileRepository.minusOnSaleProduct(
          queryRunner,
          userProfile,
        );

        // 3. 입찰하고 있는 사용자 : 입찰중인 물품 수 -1
        const isBiddingProduct =
          await this.biddingLogRepository.isBiddingProduct({
            productId: pid,
            userId,
          });

        // (해당 물품을 입찰 중이면)
        if (isBiddingProduct) {
          await this.userProfileRepository.minusBiddingProductCount(
            queryRunner,
            userProfile,
          );
        }

        // 4. product의 owner 정하기
        // 5. bidding Log => biddingSuccess True 설정
        const ownerLog = await this.biddingLogRepository.winningBid(pid);
        // (입찰이 성공하였으면)
        if (ownerLog) {
          const logId = ownerLog.id;
          const ownerId = ownerLog.user.id;
          await this.productRepository.updateOwner({
            queryRunner,
            pid,
            id: ownerId,
          });

          await this.biddingLogRepository.updateBiddingSuccess({
            queryRunner,
            logId,
          });
        }

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();

        throw new HttpException('트랜잭션 에러 발생', 400);
      } finally {
        await queryRunner.release();
      }

      this.schedulerRegistry.deleteCronJob(pid);
    });

    this.schedulerRegistry.addCronJob(pid, job);
    job.start();

    this.logger.debug(`${pid} 경매가 ${endDate}에 종료됩니다.`);
  }

  async addAllBiddingEndCronJob() {
    const productList = await this.productRepository.findAllProducts();

    for (const product of productList) {
      if (product.endTime > new Date(Date.now())) {
        const endDateTime = new Date(product.endTime);
        await this.addBiddingEndCronJob(product.id.toString(), endDateTime);
      }
    }
  }
}
