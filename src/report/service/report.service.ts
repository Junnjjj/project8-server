import { HttpException, Injectable } from '@nestjs/common';
import { NewsCommentReportRepository } from '../NewsCommentReport.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly ncReportRepository: NewsCommentReportRepository,
  ) {}

  async reportNewsComment({ user, cid }) {
    const userId = user.id;
    const commentId = cid;

    // 1. 이미 신고한 상태면 => 알려주기
    const existReport = await this.ncReportRepository.checkExistReport({
      commentId,
      userId,
    });

    if (existReport) {
      throw new HttpException('이미 신고한 게시물 입니다', 400);
    }

    return await this.ncReportRepository.reportComment({ commentId, userId });
  }
}
