import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsFavorite } from '../entity/NewsFavorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NFavoriteRepository {
  constructor(
    @InjectRepository(NewsFavorite)
    private newsFavoriteRepository: Repository<NewsFavorite>,
  ) {}

  async checkExistFavorite({ newsId, userId }) {
    try {
      const favorites = await this.newsFavoriteRepository
        .createQueryBuilder('newsFavorites')
        .where('newsId = :newsId', { newsId: newsId })
        .andWhere('userId = :userId', { userId: userId })
        .getOne();

      return favorites ? true : false;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async deleteFavorite({ newsId, userId }) {
    try {
      await this.newsFavoriteRepository
        .createQueryBuilder('newsFavorite')
        .delete()
        .where('newsId = :newsId', { newsId: newsId })
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

  async enrollFavorite({ newsId, userId }) {
    try {
      const result = await this.newsFavoriteRepository.save({
        user: userId,
        news: newsId,
      });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
