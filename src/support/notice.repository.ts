import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from '../entity/notice.entity';

@Injectable()
export class NoticeRepository {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {}

  async findNoticeByNid(nid): Promise<Notice | null> {
    try {
      const result = await this.noticeRepository.findOne({
        where: { id: nid },
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async createNotice(queryRunner, notice) {
    return await queryRunner.manager.save(Notice, notice);
  }

  async updateNotice(nid, newTitle, newContent) {
    try {
      await this.noticeRepository
        .createQueryBuilder('notice')
        .update(Notice)
        .set({
          title: newTitle,
          content: newContent,
        })
        .where('id = :nid', { nid: nid })
        .execute();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async deleteNotice(nid) {
    try {
      await this.noticeRepository
        .createQueryBuilder('notice')
        .delete()
        .from(Notice)
        .where('id = :nid', { nid: nid })
        .execute();
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
