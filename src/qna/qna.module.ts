import { Module } from '@nestjs/common';
import { QnaController } from './controller/qna.controller';
import { QnaService } from './service/qna.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qna } from '../entity/qna.entity';
import { QnaRepository } from './qna.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Qna]), ProductModule],
  controllers: [QnaController],
  providers: [QnaService, QnaRepository],
  exports: [QnaService, QnaRepository],
})
export class QnaModule {}
