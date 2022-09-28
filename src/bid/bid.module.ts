import { forwardRef, Module } from '@nestjs/common';
import { BidController } from './controller/bid.controller';
import { BidService } from './service/bid.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService],
})
export class BidModule {}
