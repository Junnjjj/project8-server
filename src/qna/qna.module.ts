import { Module } from '@nestjs/common';
import { QnaController } from './controller/qna.controller';
import { QnaService } from './service/qna.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qna } from '../entity/qna.entity';
import { QnaRepository } from './qna.repository';
import { UserModule } from '../user/user.module';
import { AlarmModule } from '../alarm/alarm.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [UserModule, AlarmModule,ProductModule ,TypeOrmModule.forFeature([Qna])],
  controllers: [QnaController],
  providers: [QnaService, QnaRepository],
  exports: [QnaService, QnaRepository],
})
export class QnaModule {}
