import { Injectable } from '@nestjs/common';
import { NewsRepository } from '../news.repository';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  async createNews(body, role) {
    const authorityId = role.id;

    const { title, subTitle, description, openDate, price } = body;

    const newNews = await this.newsRepository.createNews({
      authorityId,
      title,
      subTitle,
      description,
      openDate,
      price,
    });

    return newNews;
  }
}
