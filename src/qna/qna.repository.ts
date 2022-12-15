import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qna } from '../entity/qna.entity';

@Injectable()
export class QnaRepository {
  constructor(
    @InjectRepository(Qna)
    private qnaRepository: Repository<Qna>,
  ) {}

  async findAllQnaByPid(productId): Promise<Qna[] | null> {
    try {
      const qnaList = await this.qnaRepository.find({
        where: { productId: productId },
      });
      return qnaList;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async createQna(queryRunner, qna) {
    return await queryRunner.manager.save(Qna, qna);
  }
}
