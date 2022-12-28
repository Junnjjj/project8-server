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

  async checkQnaOwner({ userId, id }) {
    try {
      const result = await this.qnaRepository
        .createQueryBuilder('qna')
        .where('id = :id', { id: id })
        .getOne();
      return result.userId === userId ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAllQnaByPid(productId): Promise<Qna[] | null> {
    try {
      // const qnaList = await this.qnaRepository.find({
      //   where: { productId: productId },
      // });
      const qnaList = await this.qnaRepository
        .createQueryBuilder('qna')
        .leftJoinAndSelect('qna.user', 'user')
        .select([
          'qna.id as id',
          'qna.createdDate as createdDate',
          'qna.reference as reference',
          'qna.content as content',
          'qna.userId as userId',
          'user.name as nickname',
        ])
        .where({ productId: productId })
        .getRawMany();
      return qnaList;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findQnaByQid(qid): Promise<Qna | null> {
    try {
      const result = await this.qnaRepository.findOne({
        where: { id: qid },
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async createQna(queryRunner, qna) {
    return await queryRunner.manager.save(Qna, qna);
  }

  async updateQna(id, newContent: string) {
    try {
      await this.qnaRepository
        .createQueryBuilder('qna')
        .update(Qna)
        .set({
          content: newContent,
        })
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async deleteQna(id) {
    try {
      await this.qnaRepository
        .createQueryBuilder('qna')
        .softDelete()
        .from(Qna)
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
