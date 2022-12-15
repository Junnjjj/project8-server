import { HttpException, Injectable } from '@nestjs/common';
import { NewsRepository } from '../news.repository';
import { NewsFileRepository } from '../newsFile.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly newsFileRepository: NewsFileRepository,
    private dataSource: DataSource,
  ) {}

  async showNewsByPage(page, limit) {
    const newsList = await this.newsRepository.findNewsByPage(page, limit);

    if (newsList.length !== 0) {
      for (const newsItem of newsList) {
        const newsId = newsItem.id;
        const img = await this.newsFileRepository.getOneImg(newsId);
        newsItem['mainUrl'] = img;
      }
    }
    return newsList;
  }

  async showOneNews(newsId) {
    return await this.newsRepository.findNewsById(newsId);
  }

  async createNews(body, role) {
    const authorityId = role.id;

    const {
      title,
      subTitle,
      description,
      openDate,
      price,
      imagesName,
      uploadImgFromServer,
    } = body;

    // transaction 생성
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. News 생성
      const newNews = await this.newsRepository.createNews(queryRunner, {
        authorityId,
        title,
        subTitle,
        description,
        openDate,
        price,
      });

      // 2. 이미지 파일들 외래키 설정
      const result = await this.newsFileRepository.setImgFKActive(queryRunner, {
        uploadImgFromServer,
        imagesName,
        newNews,
      });

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async saveNewsImg(file, imgName) {
    return await this.newsFileRepository.saveNewsImg(file, imgName);
  }
}
