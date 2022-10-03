import { forwardRef, Module } from '@nestjs/common';
import { BidController } from './controller/bid.controller';
import { BidService } from './service/bid.service';
import { ProductModule } from '../product/product.module';
import { BiddingLogRepository } from './biddingLog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddingLog } from '../entity/biddingLog.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, ProductModule, TypeOrmModule.forFeature([BiddingLog])],
  controllers: [BidController],
  providers: [BidService, BiddingLogRepository],
  exports: [BidService],
})
export class BidModule {}
