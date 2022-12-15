import { HttpException, Injectable } from '@nestjs/common';
import { QnaRepository } from '../qna.repository';
import { QnaRequestDto } from '../dto/qna.request.dto';
import { User } from '../../entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class QnaService {
  constructor(
    private readonly qnaRepository: QnaRepository,
    private dataSource: DataSource,
  ) {}

  async showAllQnaByPid(productId) {
    const qnaList = await this.qnaRepository.findAllQnaByPid(productId);
    return qnaList;
  }

  async createQna(
    body: QnaRequestDto,
    user: User,
    productId: number,
    questionId: number = null,
  ) {
    const userId = user.id;
    const qid = questionId ? questionId : null;
    const { content } = body;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newQna = await this.qnaRepository.createQna(queryRunner, {
        reference: qid,
        content,
        product: productId,
        user: userId,
      });

      await queryRunner.commitTransaction();

      return newQna;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
