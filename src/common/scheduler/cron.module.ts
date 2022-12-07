import { forwardRef, Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ProductModule } from '../../product/product.module';
import { UserModule } from '../../user/user.module';
import { BidModule } from '../../bid/bid.module';
import { AlarmModule } from '../../alarm/alarm.module';

@Module({
  imports: [
    UserModule,
    BidModule,
    AlarmModule,
    forwardRef(() => ProductModule),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
