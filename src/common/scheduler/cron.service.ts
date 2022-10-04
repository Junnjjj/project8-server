import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ProductRepository } from '../../product/product.repository';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly productRepository: ProductRepository,
  ) {}

  private readonly logger = new Logger(CronService.name);

  async addBiddingEndCronJob(id: string, endDate: Date) {
    const job = new CronJob(endDate, () => {
      this.logger.debug(`(${id} 경매 종료. 종료 시간: ${endDate}`);
      this.productRepository.updateActiveToFalse(id); //product의 active를 false로 설정
      this.schedulerRegistry.deleteCronJob(id);
    });

    this.schedulerRegistry.addCronJob(id, job);
    job.start();

    this.logger.debug(`${id} 경매가 ${endDate}에 종료됩니다.`);
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
