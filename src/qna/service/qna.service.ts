import { HttpException, Injectable } from '@nestjs/common';
import { QnaRepository } from '../qna.repository';
import { QnaRequestDto } from '../dto/qna.request.dto';
import { User } from '../../entity/user.entity';
import { DataSource } from 'typeorm';
import { ProductRepository } from '../../product/product.repository';

@Injectable()
export class QnaService {
  constructor(
    private readonly qnaRepository: QnaRepository,
    private dataSource: DataSource,
    private readonly productRepository: ProductRepository,
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
      //answer 일 경우
      if (qid) {
        const product = await this.productRepository.findProductPId(productId);
        //pid 제품의 판매자가 user와 같지 않으면 예외처리
        if (product.id != userId) {
          throw new HttpException('제품의 판매자가 아닙니다.', 400);
        }
        //reference qid의 question이 존재하는지 확인
        const question = await this.qnaRepository.findQnaByQid(qid);
        if (!question) {
          throw new HttpException('질문이 존재하지 않습니다.', 400);
        }
      }

      const newQna = await this.qnaRepository.createQna(queryRunner, {
        reference: qid,
        content,
        productId: productId,
        userId: userId,
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

  async updateQna({ user, id }, body) {
    const { content } = body;
    const userId = user.id;
    const isMyQna = await this.qnaRepository.checkQnaOwner({
      userId,
      id,
    });
    if (!isMyQna) {
      throw new HttpException('Qna의 사용자가 아닙니다.', 401);
    }

    return await this.qnaRepository.updateQna(id, content);
  }

  async deleteQna({ user, id }) {
    const userId = user.id;
    const isMyQna = await this.qnaRepository.checkQnaOwner({
      userId,
      id,
    });
    if (!isMyQna) {
      throw new HttpException('Qna의 사용자가 아닙니다.', 401);
    }

    return await this.qnaRepository.deleteQna(id);
  }
}
