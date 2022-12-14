import { Injectable } from '@nestjs/common';
import { NewsRepository } from '../news.repository';
import { NewsFileRepository } from '../newsFile.repository';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly newFileRepository: NewsFileRepository,
  ) {}

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

  async saveNewsImg(file, imgName) {
    return await this.newFileRepository.saveNewsImg(file, imgName);
  }
}
