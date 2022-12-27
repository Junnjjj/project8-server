import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportService } from '../service/report.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  //News Comment 신고하기
  @Get('/news/comment/:cid')
  @UseGuards(JwtAuthGuard)
  reportNewsComment(@CurrentUser() user, @Param('cid') cid: number) {
    return this.reportService.reportNewsComment({ user, cid });
  }
}
