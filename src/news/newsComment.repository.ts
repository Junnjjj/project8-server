import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsComment } from '../entity/newsComment.entity';
import { Column, Repository } from 'typeorm';

@Injectable()
export class NewsCommentRepository {
  constructor(
    @InjectRepository(NewsComment)
    private newsCommentRepository: Repository<NewsComment>,
  ) {}

  async createComment(userId, newsId, content) {
    try {
      const result = this.newsCommentRepository.save({
        userId: userId,
        newsId: newsId,
        comment: content,
      });
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async getComments(newsId) {
    try {
      const newsComments = await this.newsCommentRepository
        .createQueryBuilder('newsComment')
        .leftJoinAndSelect('newsComment.user', 'user')
        .select([
          'newsComment.id as id',
          'newsComment.userId as userId',
          'newsComment.comment as comment',
          'user.name as nickname',
          'newsComment.createdDate as createdDate',
        ])
        .where({ newsId: newsId })
        .getRawMany();
      return newsComments;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async checkCommentOwner({ userId, commentId }): Promise<boolean> {
    try {
      const result = await this.newsCommentRepository
        .createQueryBuilder('newsComment')
        .where({ id: commentId })
        .getOne();
      return result.userId === userId ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async deleteComment(commentId) {
    try {
      const result = await this.newsCommentRepository
        .createQueryBuilder('newsComment')
        .softDelete()
        .from(NewsComment)
        .where({ id: commentId })
        .execute();
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
