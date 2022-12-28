import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnaReport } from '../entity/qnaReport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QnaReportRepository {
  constructor(
    @InjectRepository(QnaReport)
    private qnaReportRepository: Repository<QnaReport>,
  ) {}

  async checkExistReport({ qnaId, userId }) {
    try {
      const report = await this.qnaReportRepository
        .createQueryBuilder('report')
        .where('qnaId = :qnaId', { qnaId: qnaId })
        .andWhere('userId = :userId', { userId: userId })
        .getOne();
      return report ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async reportComment({ qnaId, userId }) {
    try {
      const result = await this.qnaReportRepository.save({
        qna: qnaId,
        user: userId,
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
