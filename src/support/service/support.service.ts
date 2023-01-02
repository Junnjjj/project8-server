import { HttpException, Injectable } from '@nestjs/common';
import { NoticeRepository } from '../notice.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../user/user.repository';
import { InquiryRepository } from '../inquiry.repository';

@Injectable()
export class SupportService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly inquiryReposityry: InquiryRepository,
    private readonly userRepository: UserRepository,
    private dataSource: DataSource,
  ) {}

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
}
