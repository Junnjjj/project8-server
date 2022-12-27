import { forwardRef, Module } from '@nestjs/common';
import { BidController } from './controller/bid.controller';
import { BidService } from './service/bid.service';
import { ProductModule } from '../product/product.module';
import { BiddingLogRepository } from './biddingLog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddingLog } from '../entity/biddingLog.entity';
import { UserModule } from '../user/user.module';
import { AlarmModule } from '../alarm/alarm.module';

@Module({
  imports: [
    UserModule,
    AlarmModule,
    TypeOrmModule.forFeature([BiddingLog]),
    forwardRef(() => ProductModule),
  ],
  controllers: [BidController],
  providers: [BidService, BiddingLogRepository],
  exports: [BidService, BiddingLogRepository],
})
export class BidModule {}
