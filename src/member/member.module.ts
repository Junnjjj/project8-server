import { Module } from '@nestjs/common';
import { MemberController } from './controller/member.controller';
import { MemberService } from './service/member.service';
import { UserModule } from '../user/user.module';
import { BidModule } from '../bid/bid.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [UserModule, BidModule, ProductModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
