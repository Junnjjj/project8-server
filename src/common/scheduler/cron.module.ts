import { forwardRef, Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ProductModule } from '../../product/product.module';
import { UserModule } from '../../user/user.module';
import { BidModule } from '../../bid/bid.module';
import { AlarmModule } from '../../alarm/alarm.module';
import { CacheModule } from '../../cache/cache.module';

@Module({
  imports: [
    UserModule,
    BidModule,
    AlarmModule,
    forwardRef(() => ProductModule),
    CacheModule,
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
