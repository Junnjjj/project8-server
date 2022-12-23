import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductFile } from '../entity/productFile.entity';
import { NewsFile } from '../entity/newsFile.entity';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(News) private newsRepository: Repository<News>,
  ) {}

  async findNewsById(newsId) {
    try {
      const news = await this.newsRepository
        .createQueryBuilder('news')
        .leftJoinAndSelect('news.newsFiles', 'newsFile')
        .leftJoinAndSelect('news.newsFavorites', 'favorite')
        .where({ id: newsId })
        .getOne();
      return news;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async createNews(queryRunner, news) {
    return await queryRunner.manager.save(News, news);
  }

  async findNewsByPage(page, limit) {
    const skip = (page - 1) * limit; // 스킵할 news 수
    try {
      const newsList = await this.newsRepository
        .createQueryBuilder('news')
        .select([
          'news.id as id',
          'news.title as title',
          'news.subTitle as subTitle',
          'news.openDate as openDate',
          'news.price as price',
        ])
        .limit(limit)
        .offset(skip)
        .getRawMany();

      return newsList;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async getNewsLength() {
    try {
      const result = await this.newsRepository
        .createQueryBuilder('news')
        .select('count(*) as length')
        .getRawOne();

      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
