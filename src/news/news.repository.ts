import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { Repository } from 'typeorm';
import { ProductFile } from '../entity/productFile.entity';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(News) private newsRepository: Repository<News>,
  ) {}

  async createNews({
    authorityId,
    title,
    subTitle,
    description,
    openDate,
    price,
  }) {
    try {
      const result = this.newsRepository
        .createQueryBuilder('news')
        .insert()
        .into(News)
        .values({
          title: title,
          subTitle: subTitle,
          description: description,
          openDate: openDate,
          price: price,
          authorityId: authorityId,
        })
        .execute();
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
