import { Module } from '@nestjs/common';
import { ReportController } from './controller/report.controller';
import { ReportService } from './service/report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsCommentReport } from '../entity/newsCommentReport.entity';
import { NewsCommentReportRepository } from './NewsCommentReport.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NewsCommentReport])],
  controllers: [ReportController],
  providers: [ReportService, NewsCommentReportRepository],
})
export class ReportModule {}
