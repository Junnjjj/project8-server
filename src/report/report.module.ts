import { Module } from '@nestjs/common';
import { ReportController } from './controller/report.controller';
import { ReportService } from './service/report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsCommentReport } from '../entity/newsCommentReport.entity';
import { NewsCommentReportRepository } from './NewsCommentReport.repository';
import { QnaReport } from '../entity/qnaReport.entity';
import { QnaReportRepository } from './qnaReport.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NewsCommentReport, QnaReport])],
  controllers: [ReportController],
  providers: [ReportService, NewsCommentReportRepository, QnaReportRepository],
})
export class ReportModule {}
