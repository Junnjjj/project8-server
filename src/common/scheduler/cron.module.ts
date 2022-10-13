import { forwardRef, Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ProductModule } from '../../product/product.module';
import { UserModule } from '../../user/user.module';
import { BidModule } from '../../bid/bid.module';

@Module({
  imports: [UserModule, BidModule, forwardRef(() => ProductModule)],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
