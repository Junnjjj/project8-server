import {forwardRef, HttpException, Inject, Injectable, Logger} from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ProductRepository } from '../../product/product.repository';
import { UserProfileRepository } from '../../user/userProfile.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../user/user.repository';
import { BiddingLogRepository } from '../../bid/biddingLog.repository';
import { AlarmRepository } from '../../alarm/alarm.repository';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly productRepository: ProductRepository,
    private readonly biddingLogRepository: BiddingLogRepository,
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly alarmRepository: AlarmRepository,
    @Inject(forwardRef(() => CacheService))
    private readonly cacheService: CacheService,
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

          // 5-1. owner 에게 입찰 성공 알람, 판매자에게 판매 성공 알람
          await this.alarmRepository.createAlarmWithQueryRunner({
            queryRunner,
            productId: pid,
            userId: ownerId,
            type: 1,
          });

          await this.alarmRepository.createAlarmWithQueryRunner({
            queryRunner,
            productId: pid,
            userId: userId,
            type: 2,
          });
        } else {
          // 6. 입찰이 실패했다면 판매자에게 판매 실패 알람
          await this.alarmRepository.createAlarmWithQueryRunner({
            queryRunner,
            productId: pid,
            userId: userId,
            type: 3,
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

  @Cron('0 0 * * * *') // 매시 0분마다 업데이트ㄷ
  async updateMysqlFromRedis() {
    this.logger.debug(`Update visitors data to mysql from redis`);
    try {
      // 레디스에 저장된 조회수를 mysql에 업데이트
      await this.cacheService.updateAllVisitors();
    } catch (err) {
      throw new HttpException('트랜잭션 에러 발생', 400);
    }
  }
}
