import { Module } from '@nestjs/common';
import { SupportController } from './controller/support.controller';
import { SupportService } from './service/support.service';
import { UserModule } from '../user/user.module';
import { NoticeRepository } from './notice.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from '../entity/notice.entity';
import { Inquiry } from '../entity/inquiry.entity';
import { InquiryRepository } from './inquiry.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Notice, Inquiry])],
  controllers: [SupportController],
  providers: [SupportService, NoticeRepository, InquiryRepository],
  exports: [SupportService, NoticeRepository, InquiryRepository],
})
export class SupportModule {}
