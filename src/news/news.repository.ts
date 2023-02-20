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
        .where({ slug: newsId })
        .getOne();
      return news;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async createNews(queryRunner, news) {
    return await queryRunner.manager.save(News, news);
  }

  async searchNewsByKeyword(keyword) {
    try {
      const newsList = await this.newsRepository
        .createQueryBuilder('news')
        .select([
          'news.slug as slug',
          'news.title as title',
          'news.subTitle as subTitle',
        ])
        .where('news.title like :keyword', { keyword: `%${keyword}%` })
        .orWhere('news.subTitle like :keyword', { keyword: `%${keyword}` })
        .orWhere('news.category like :keyword', { keyword: `%${keyword}` })
        .getRawMany();

      return newsList;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findNewsByPage(page, limit, order) {
    const skip = (page - 1) * limit; // 스킵할 news 수
    const sort = order === 'latest' ? 0 : 1;
    try {
      const newsList = await this.newsRepository
        .createQueryBuilder('news')
        .leftJoinAndSelect('news.newsFavorites', 'favorite')
        .leftJoinAndSelect('news.newsComments', 'comment')
        .select([
          'news.id as id',
          'news.slug as slug',
          'news.title as title',
          'news.subTitle as subTitle',
          'news.openDate as openDate',
          'news.price as price',
          'news.createDate as createDate',
        ])
        .addSelect('COUNT(favorite.id) as favorite')
        .addSelect('COUNT(comment.id) as comment')
        .groupBy('news.id')
        // .orderBy({ 'news.createDate': 'DESC' })
        .orderBy(
          sort === 0
            ? { 'news.createDate': 'DESC' }
            : { 'COUNT(comment.id) + COUNT(favorite.id)/0.5': 'DESC' },
        )
        .limit(limit)
        .offset(skip)
        .getRawMany();

      return newsList;
    } catch (error) {
      throw new HttpException(error, 400, {
        cause: new Error('Some Error'),
      });
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
  async setVisitors(newsId, visitors) {
    try {
      await this.newsRepository.update(
        { slug: newsId },
        { visitors: visitors },
      );
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async getVisitors(newsId) {
    try {
      const result = await this.findNewsById(newsId);
      return result.visitors;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
