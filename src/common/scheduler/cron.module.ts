import { forwardRef, Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ProductModule } from '../../product/product.module';

@Module({
  imports: [forwardRef(() => ProductModule)],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
