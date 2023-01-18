import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../entity/inquiry.entity';

@Injectable()
export class InquiryRepository {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
  ) {}

  async findAllInquiry(): Promise<Inquiry[] | null> {
    try {
      const result = await this.inquiryRepository.find({
        order: {
          createDate: 'DESC',
        },
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findMyInquiry(userId): Promise<Inquiry[] | null> {
    try {
      const result = await this.inquiryRepository.find({
        where: {
          userId: userId,
        },
        order: {
          createDate: 'DESC',
        },
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findInquiryByIid(iid): Promise<Inquiry | null> {
    try {
      const result = await this.inquiryRepository.findOne({
        where: { id: iid },
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async createInquiry(queryRunner, inquiry) {
    return await queryRunner.manager.save(Inquiry, inquiry);
  }

  async createIAnswer(iid, answer, answerDate, authorityId) {
    try {
      await this.inquiryRepository
        .createQueryBuilder('inquiry')
        .update(Inquiry)
        .set({
          answer: answer,
          answerDate: answerDate,
          authorityId: authorityId,
        })
        .where('id = :iid', { iid: iid })
        .execute();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
