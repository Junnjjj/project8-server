import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ProductRepository } from '../../product/product.repository';
import { UserProfileRepository } from '../../user/userProfile.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../user/user.repository';
import { BiddingLogRepository } from '../../bid/biddingLog.repository';
import { InjectRepository } from '@nestjs/typeorm';

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
      this.logger.debug(
        `item number : ${pid} bidding finish. bidding time is : ${endDate}`,
      );
      // 1. product 의 active 를 false 로 설정
      await this.productRepository.updateActiveToFalse(pid);

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // 2. product 판매자의 onSaleProduct -1
        const product = await this.productRepository.findProductPId(pid);
        const userId = product.user.id;
        const userProfile = await this.userRepository.findProfileId(userId);

        await this.userProfileRepository.minusOnSaleProduct(
          queryRunner,
          userProfile,
        );

        // 3. 입찰한 사람들 biddingProduct - 1
        const biddingUserIds =
          await this.biddingLogRepository.distinctBiddingUserId(pid);
        // (빈배열이 아니면 => 입찰한 사람이 있을경우)
        if (biddingUserIds) {
          for (let i = 0; i < biddingUserIds.length; i++) {
            const individualUserId = biddingUserIds[i].userId;
            const individualProfile = await this.userRepository.findProfileId(
              individualUserId,
            );
            await this.userProfileRepository.minusBiddingProductCount(
              queryRunner,
              individualProfile,
            );
          }
        }

        const ownerLog = await this.biddingLogRepository.getWinningBid(pid);
        // (입찰이 성공하였으면)
        if (ownerLog) {
          const logId = ownerLog.id;
          const ownerId = ownerLog.user.id;
          // 4. product 의 owner 정하기
          await this.productRepository.updateOwner({
            queryRunner,
            pid,
            id: ownerId,
          });

          // 5. bidding Log => biddingSuccess True 설정
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
        this.schedulerRegistry.deleteCronJob(pid);
      }
    });

    this.schedulerRegistry.addCronJob(pid, job);
    job.start();

    this.logger.debug(
      `Product id ${pid} is bidding start, Bidding finish at ${endDate}`,
    );
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
