import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsCommentFavorite } from '../entity/newsCommentFavorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NCFavoriteRepository {
  constructor(
    @InjectRepository(NewsCommentFavorite)
    private commentFavoriteRepository: Repository<NewsCommentFavorite>,
  ) {}

  async checkExistFavorite({ commentId, userId }): Promise<boolean> {
    try {
      const favorites = await this.commentFavoriteRepository
        .createQueryBuilder('commentFavorite')
        .where('commentId = :commentId', { commentId: commentId })
        .andWhere('userId = :userId', { userId: userId })
        .getOne();

      return favorites ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async deleteFavorite({ commentId, userId }) {
    try {
      await this.commentFavoriteRepository
        .createQueryBuilder('commentFavorite')
        .delete()
        .where('commentId = :commentId', { commentId: commentId })
        .andWhere('userId = :userId', { userId: userId })
        .execute();

      const response = {
        message: '관심 목록에서 삭제되었습니다.',
        code: '200',
      };
      return response;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async enrollFavorite({ userId, commentId }) {
    try {
      const result = await this.commentFavoriteRepository.save({
        user: userId,
        comment: commentId,
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
