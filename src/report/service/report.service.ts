import { HttpException, Injectable } from '@nestjs/common';
import { NewsCommentReportRepository } from '../NewsCommentReport.repository';
import { QnaReportRepository } from '../qnaReport.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly ncReportRepository: NewsCommentReportRepository,
    private readonly qnaReportRepository: QnaReportRepository,
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

  async reportQna({ user, qid }) {
    const userId = user.id;
    const qnaId = qid;

    //  1. 이미 신고한 상태면 => 알려주기
    const existReport = await this.qnaReportRepository.checkExistReport({
      qnaId,
      userId,
    });

    if (existReport) {
      throw new HttpException('이미 신고한 게시물 입니다', 400);
    }

    return await this.qnaReportRepository.reportComment({ qnaId, userId });
  }
}
