import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronService } from './common/scheduler/cron.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly cronService: CronService) {}
  getHello(): string {
    return 'Hello World!';
  }

  //서버 모듈 init시 cron job 추가
  async onModuleInit(): Promise<void> {
    await this.cronService.addAllBiddingEndCronJob();
  }
}
