import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsCommentReport } from '../entity/newsCommentReport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsCommentReportRepository {
  constructor(
    @InjectRepository(NewsCommentReport)
    private NCReportRepository: Repository<NewsCommentReport>,
  ) {}

  async checkExistReport({ commentId, userId }) {
    try {
      const report = await this.NCReportRepository.createQueryBuilder('report')
        .where('commentId = :commentId', { commentId: commentId })
        .andWhere('userId = :userId', { userId: userId })
        .getOne();

      return report ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async reportComment({ commentId, userId }) {
    try {
      const result = await this.NCReportRepository.save({
        comment: commentId,
        user: userId,
      });
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
