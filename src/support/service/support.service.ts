import { HttpException, Injectable } from '@nestjs/common';
import { NoticeRepository } from '../notice.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../user/user.repository';
import { InquiryRepository } from '../inquiry.repository';
import { InquiryRequestDto } from '../dto/inquiry.request.dto';
import { User } from '../../entity/user.entity';
import { Notice } from '../../entity/notice.entity';
import { Inquiry } from '../../entity/inquiry.entity';
import { IAnswerRequestDto } from '../dto/iAnswer.request.dto';

@Injectable()
export class SupportService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly inquiryRepository: InquiryRepository,
    private readonly userRepository: UserRepository,
    private dataSource: DataSource,
  ) {}

  async findAllNotice(): Promise<Notice[] | null> {
    return await this.noticeRepository.findAllNotice();
  }

  async findAllInquiry(): Promise<Inquiry[] | null> {
    return await this.inquiryRepository.findAllInquiry();
  }

  async createNotice(body, role) {
    const authorityId = role.id;

    const { title, content } = body;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newNotice = await this.noticeRepository.createNotice(queryRunner, {
        authorityId,
        title,
        content,
      });

      await queryRunner.commitTransaction();

      return newNotice;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async updateNotice(nid, body, role) {
    const authorityId = role.id;

    const noticeWriter = await this.noticeRepository.findNoticeByNid(nid);

    if (authorityId != noticeWriter.authorityId) {
      throw new HttpException('공지사항의 작성자가 아닙니다.', 401);
    }

    const { title, content } = body;

    return await this.noticeRepository.updateNotice(nid, title, content);
  }

  async deleteNotice(nid, role) {
    const authorityId = role.id;

    const noticeWriter = await this.noticeRepository.findNoticeByNid(nid);

    if (authorityId != noticeWriter.authorityId) {
      throw new HttpException('공지사항의 작성자가 아닙니다.', 401);
    }

    return await this.noticeRepository.deleteNotice(nid);
  }

  async createInquiry(body: InquiryRequestDto, user: User) {
    const userId = user.id;
    const { phoneNumber, title, content } = body;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newInquiry = await this.inquiryRepository.createInquiry(
        queryRunner,
        {
          phoneNumber: phoneNumber,
          title: title,
          content: content,
          userId: userId,
        },
      );
      await queryRunner.commitTransaction();
      return newInquiry;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async createAnswer(iid, body: IAnswerRequestDto, role) {
    const authorityId = role.id;

    const inquiryWriter = await this.inquiryRepository.findInquiryByIid(iid);

    if (!inquiryWriter) {
      throw new HttpException('문의가 없습니다.', 400);
    }

    const { answer } = body;
    const answerDate = new Date(Date.now());

    return await this.inquiryRepository.createIAnswer(
      iid,
      answer,
      answerDate,
      authorityId,
    );
  }
}
